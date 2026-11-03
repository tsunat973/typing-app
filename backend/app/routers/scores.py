# API-02, API-03: スコアの保存とランキングの窓口
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import RankingItem, ScoreCreate, ScoreCreated
from app.services import ScoreService

router = APIRouter(prefix="/api", tags=["scores"])


# POST /api/scores
# ScoreCreate で受け取ると、名前の長さやスコアの範囲は FastAPI が自動で検証する。
# 条件に合わないときは、この関数が動く前に弾かれる（今は 422。400 への変換は 11/4）
@router.post("/scores", response_model=ScoreCreated, status_code=201)
def create_score(data: ScoreCreate, db: Session = Depends(get_db)):
    return ScoreService(db).create(data)


# GET /api/ranking
@router.get("/ranking", response_model=list[RankingItem])
def get_ranking(db: Session = Depends(get_db)):
    return ScoreService(db).get_ranking()
