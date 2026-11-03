# API-01: お題を取得する窓口
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ProblemOut
from app.services import ProblemService

# prefix: このファイルの窓口は、すべて /api/problems から始まる
router = APIRouter(prefix="/api/problems", tags=["problems"])

# 通常モードで受け付ける言語
LANGS = ("react", "python")


# 言語やモードが正しくないときの返事（基本設計書 8章のエラー形式、E001）
def lang_error() -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={"error": {"code": "E001", "message": "対応していない言語です"}},
    )


# GET /api/problems?mode=normal&lang=python
# mode を省略すると normal。mode や lang が正しくなければ、サービスに渡さず 400 を返す
@router.get("", response_model=list[ProblemOut])
def get_problems(
    mode: str = "normal",
    lang: str | None = None,
    db: Session = Depends(get_db),  # 注文票（Session）を用意して渡してもらう
):
    service = ProblemService(db)

    if mode == "mixed":
        # 混合モードは言語を指定しない（lang が来ても使わない）
        return service.get_mixed()
    if mode == "normal" and lang in LANGS:
        return service.get_normal(lang)

    return lang_error()
