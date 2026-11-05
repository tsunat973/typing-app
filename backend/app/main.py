# アプリの入口。アプリ本体を作り、CORS を設定し、ルーターをつなぐ
import logging
import os

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine
from app.routers import problems, scores

# 手元の SQLite のときだけ、テーブルを自動で作る。
# Supabase のテーブルは作成済みなので、本番では何もしない
if engine.dialect.name == "sqlite":
    Base.metadata.create_all(engine)

app = FastAPI(title="typing-app API")

logger = logging.getLogger("typing-app")


# --- エラーレスポンス（基本設計書 8章）---
# どのエラーも { "error": { "code", "message" } } の形にそろえる
def error_response(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message}},
    )


ERRORS = {
    "E001": (400, "対応していない言語です"),
    "E002": (400, "名前は1〜20文字で入力してください"),
    "E003": (400, "スコアの値が正しくありません"),
    "E004": (500, "サーバーでエラーが発生しました。時間をおいて再度お試しください"),
}


def make_error(code: str) -> JSONResponse:
    status_code, message = ERRORS[code]
    return error_response(status_code, code, message)


# どの項目が悪かったか（loc の項目名）→ エラーコード
FIELD_TO_CODE = {
    "lang": "E001",
    "name": "E002",
    "wpm": "E003",
    "accuracy": "E003",
    "miss_count": "E003",
    "mode": "E003",
}


# 入力の検証に失敗したとき、FastAPI 標準の 422 を、設計どおりの 400 に作り直す
@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    # errors() の各要素の loc は ("body", "name") のように「どこが悪いか」を持つ
    for err in exc.errors():
        loc = err["loc"]
        if len(loc) >= 2 and loc[1] in FIELD_TO_CODE:
            return make_error(FIELD_TO_CODE[loc[1]])
    # 項目を特定できないとき（JSON が壊れている、本文が空など）
    return make_error("E003")

# 想定外のエラー（DB 接続切れなど）は E004（500）にそろえる。
# CORS より内側で捕まえるのがポイント。外側だと 500 に CORS ヘッダが付かず、
# ブラウザには CORS エラーに見えて、E004 のメッセージが画面に届かない。
# （add_middleware は後に足したものが外側になるので、CORS より先に足す）
@app.middleware("http")
async def catch_unexpected_errors(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception:
        logger.exception("想定外のエラー")  # 原因は Render のログで見られる
        return make_error("E004")


# --- CORS: どのサイトからの呼び出しを許可するか ---
# 開発中のフロント（Vite）は常に許可する
origins = ["http://localhost:5173"]
# 本番のフロント（Vercel）の URL は環境変数で渡す。カンマ区切りで複数書ける
# 例: CORS_ORIGINS=https://typing-app.vercel.app
extra = os.getenv("CORS_ORIGINS", "")
origins += [o.strip().rstrip("/") for o in extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],  # このアプリが使う動詞だけ許可する
    allow_headers=["*"],
)

# 受付係（ルーター）を登録する。これで /api/... の窓口が使えるようになる
app.include_router(problems.router)
app.include_router(scores.router)
