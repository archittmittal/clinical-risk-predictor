from fastapi import APIRouter

router = APIRouter()

@router.get("/cohort")
def get_cohort():
    return {}
