from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import sys
import os
from sqlalchemy.orm import Session

# Ensure backend module can be imported
sys.path.append(os.getcwd())

from backend.database import engine, Base, get_db
from backend.models.risk_engine import RiskEngine
from backend.models.counterfactuals import Counterfactuals
from backend.models.clinical_llm import ClinicalLLM
from backend.services.history import HistoryService

# Import Schemas
from backend.schemas.patient import (
    PatientRequest, RiskResponse, ExplanationResponse, 
    ReportResponse, SimulationRequest, SimulationResponse,
    ReportGenerationRequest
)
from backend.models.user import User as UserModel
from backend.auth import get_current_user

# Import Routes
from backend.routes import cohort, feedback, fhir, auth, auth_google

from fastapi.staticfiles import StaticFiles
from backend.models.pdf_service import PDFService

# 1. Initialize App & Database
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database Error (Migration needed?): {e}")

app = FastAPI(title="Clinical Risk Predictor API", version="2.0")

# Mount PDF directory
pdf_dir = os.path.join(os.getcwd(), "backend", "pdfs")
os.makedirs(pdf_dir, exist_ok=True)
app.mount("/pdfs", StaticFiles(directory=pdf_dir), name="pdfs")

# Include Routers
app.include_router(auth.router)
app.include_router(auth_google.router)
app.include_router(cohort.router)
app.include_router(feedback.router)
app.include_router(fhir.router)

# 2. CORS Setup (Allow All for Dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load Model (Global State)
try:
    risk_engine = RiskEngine()
    print("Risk Engine loaded successfully.")
except Exception as e:
    print(f"Error loading Risk Engine: {e}")
    risk_engine = None

# Initialize Clinical LLM (Embedded)
try:
    clinical_llm = ClinicalLLM()
    print("Clinical LLM initialized.")
except Exception as e:
    print(f"Error initializing Clinical LLM: {e}")
    clinical_llm = None

# Initialize PDF Service
try:
    pdf_service = PDFService()
    print("PDF Service initialized.")
except Exception as e:
    print(f"Error initializing PDF Service: {e}")
    pdf_service = None

# 5. Helper Functions
def get_risk_level(score: float) -> str:
    if score < 0.2: return "Low"
    if score < 0.6: return "Moderate"
    return "High"

# 6. Endpoints
@app.get("/health")
def health_check():
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not initialized")
    return {"status": "healthy", "model_loaded": True}

@app.get("/")
def root():
    return {"message": "Clinical Risk Predictor API is running", "docs": "/docs"}

@app.post("/predict", response_model=RiskResponse)
def predict_risk(
    patient: PatientRequest, 
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not ready")
    
    try:
        data = patient.dict()
        # Extract metadata (legacy support, but we rely on current_user now)
        data.pop('clinician_id', None)
        data.pop('clinician_name', None)

        score = risk_engine.predict_risk(data)
        level = get_risk_level(score)
        
        # Save to database using HistoryService
        try:
            HistoryService.save_record(
                db=db, 
                user_id=current_user.id, 
                patient_data=data, 
                risk_score=score, 
                risk_level=level
            )
        except Exception as hist_e:
            print(f"Warning: Failed to save history to DB: {hist_e}")

        return {"risk_score": score, "risk_level": level}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(
    limit: int = 10, 
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return HistoryService.get_history(db, current_user.id, limit)


@app.post("/explain", response_model=ExplanationResponse)
def explain_risk(patient: PatientRequest, current_user: UserModel = Depends(get_current_user)):
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not ready")
    
    try:
        data = patient.dict()
        data.pop('clinician_id', None)
        data.pop('clinician_name', None)
        
        explanations = risk_engine.explain_risk(data)
        return {"explanations": explanations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/simulate", response_model=SimulationResponse)
def simulate_risk(request: SimulationRequest, current_user: UserModel = Depends(get_current_user)):
    if risk_engine is None:
        raise HTTPException(status_code=503, detail="Risk Engine not ready")
    
    try:
        cf = Counterfactuals(risk_engine)
        result = cf.predict_simulation(request.patient.dict(), request.modifications)
        
        original_risk = risk_engine.predict_risk(request.patient.dict())
        new_risk = result['new_risk']
        
        return {
            "original_risk": original_risk,
            "new_risk": new_risk,
            "risk_reduction": original_risk - new_risk
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate/report", response_model=ReportResponse)
def generate_simulation_report(request: SimulationRequest, current_user: UserModel = Depends(get_current_user)):
    try:
        # Calculate Risks
        original_risk = risk_engine.predict_risk(request.patient.dict())
        
        # Calculate New Risk
        cf = Counterfactuals(risk_engine)
        result = cf.predict_simulation(request.patient.dict(), request.modifications)
        new_risk = result['new_risk']
        
        # Fallback to Mock if LLM is down
        if clinical_llm is None or clinical_llm.model is None:
             report = f"Simulated Analysis: Reducing risk factors has improved the projected outcome by {((original_risk - new_risk)*100):.1f}%. Sustained adherence to these targets is expected to yield long-term benefits. (AI Offline)"
        else:
            # Generate Text
            report = clinical_llm.generate_simulation_report(
                request.patient.model_dump(), 
                result['modified_data'], 
                original_risk, 
                new_risk
            )
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/report", response_model=ReportResponse)
def generate_report(patient: PatientRequest, current_user: UserModel = Depends(get_current_user)):
    try:
        data = patient.dict()
        data.pop('clinician_id', None)
        data.pop('clinician_name', None)

        patient_name = data.pop('patient_name', None)

        score = risk_engine.predict_risk(data)
        level = get_risk_level(score)
        explanations = risk_engine.explain_risk(data)
        
        if clinical_llm is None or clinical_llm.model is None:
            print("⚠️ Using Mock AI Report due to missing LLM.")
            report = f"""
            **Clinical Validation (Simulated):**
            Based on the assessment, the patient is classified as **{level.upper()} RISK** (Score: {score:.2f}). 
            
            **Key Drivers:**
            The primary contributing factors appear to be {explanations[0]['feature'] if explanations else 'unknown'} and metabolic indicators.
            
            **Recommendations:**
            1. Initiation of standard lifestyle interventions is recommended.
            2. Follow-up testing for HbA1c and lipid panel within 3-6 months.
            3. Consider pharmacological review if risk factors persist.
            
            *Note: This is a placeholder report as the local AI model (BioMistral) is currently offline.*
            """
        else:
            report = clinical_llm.generate_report(data, score, level, explanations)
        
        pdf_filename = None
        pdf_url = None
        
        if pdf_service:
            try:
                pdf_filename = pdf_service.generate_report(data, score, level, report, explanations, patient_name=patient_name)
                pdf_url = f"/pdfs/{pdf_filename}"
            except Exception as pdf_e:
                print(f"Error generating PDF: {pdf_e}")

        return {"report": report.strip(), "pdf_url": pdf_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import StreamingResponse
import json

@app.post("/report/stream")
def generate_report_stream(
    patient: ReportGenerationRequest, 
    current_user: UserModel = Depends(get_current_user)
):
    data = patient.dict()
    # Extract optional pre-calculated data
    pre_score = data.pop('risk_score', None)
    pre_level = data.pop('risk_level', None)
    pre_explanations = data.pop('explanations', None)

    # Remove metadata
    data.pop('clinician_id', None)
    data.pop('clinician_name', None)
    patient_name = data.pop('patient_name', None)

    # Use pre-calculated data if available, otherwise calculate
    if pre_score is not None and pre_explanations is not None:
        score = pre_score
        level = pre_level if pre_level else get_risk_level(score)
        explanations = pre_explanations
    else:
        score = risk_engine.predict_risk(data)
        level = get_risk_level(score)
        explanations = risk_engine.explain_risk(data)

    def event_generator():
        # 1. Yield Risk Data first (fast)
        yield f"event: risk\ndata: {json.dumps({'risk_score': score, 'risk_level': level})}\n\n"
        
        full_report = ""
        
        # 2. Yield LLM tokens
        if clinical_llm is None or clinical_llm.model is None:
            mock_text = f"Using Mock AI (LLM Offline). Patient is {level} Risk with score {score:.2f}."
            for word in mock_text.split():
                yield f"data: {word} \n\n"
                full_report += word + " "
        else:
            for token in clinical_llm.stream_report(data, score, level, explanations):
                yield f"data: {token}\n\n"
                full_report += token
        
        # 3. Generate PDF in background
        pdf_url = None
        if pdf_service:
            try:
                pdf_filename = pdf_service.generate_report(data, score, level, full_report, explanations, patient_name=patient_name)
                pdf_url = f"/pdfs/{pdf_filename}"
            except Exception as e:
                print(f"Error generating PDF: {e}")
        
        # 4. Yield Final PDF URL
        if pdf_url:
            yield f"event: pdf\ndata: {json.dumps({'pdf_url': pdf_url})}\n\n"
            
        yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
