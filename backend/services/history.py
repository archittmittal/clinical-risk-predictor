from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.models.history import RiskAssessment
import numpy as np

class HistoryService:
    @staticmethod
    def save_record(db: Session, user_id: int, patient_data: dict, risk_score: float, risk_level: str):
        record = RiskAssessment(
            user_id=user_id,
            patient_data=patient_data,
            risk_score=risk_score,
            risk_level=risk_level
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def get_history(db: Session, user_id: int, limit: int = 10):
        # Fetch records for the specific user
        records = db.query(RiskAssessment)\
            .filter(RiskAssessment.user_id == user_id)\
            .order_by(desc(RiskAssessment.timestamp))\
            .limit(limit)\
            .all()
        
        # Convert to format expected by frontend
        history_list = []
        for r in records:
            history_list.append({
                "timestamp": r.timestamp.isoformat(),
                "patient_data": r.patient_data,
                "risk_assessment": {
                    "score": r.risk_score,
                    "level": r.risk_level
                },
                "clinician": {
                    "id": str(r.user_id),
                    "name": r.user.name if r.user else "Unknown"
                }
            })
            
        velocity, alert = HistoryService.calculate_risk_velocity(history_list)
        
        return {
            "history": history_list,
            "trend_analysis": {
                "velocity": velocity,
                "status": alert
            }
        }

    @staticmethod
    def calculate_risk_velocity(history: list) -> tuple:
        if len(history) < 2:
            return 0.0, "Insufficient Data"
        
        # Get last 5 data points (they are already sorted new->old, so reverse them for calc)
        data_points = history[:5][::-1]
        scores = [r['risk_assessment']['score'] for r in data_points]
        x = range(len(scores))
        
        try:
            if len(scores) < 2:
                 return 0.0, "Insufficient Data"

            slope = float(np.polyfit(x, scores, 1)[0])
            
            if slope > 0.05:
                status = "Critical: Rapid Risk Increase 🔺"
            elif slope > 0.01:
                status = "Warning: Rising Risk ⚠️"
            elif slope < -0.01:
                status = "Positive: Risk Decreasing 📉"
            else:
                status = "Stable 🔵"
                
            return round(slope, 4), status
        except Exception:
            return 0.0, "Error"
