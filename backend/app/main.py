# アプリの入口。アプリ本体を作り、CORS を設定し、ルーターをつなぐ
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import problems, scores

# 手元の SQLite のときだけ、テーブルを自動で作る。
# Supabase のテーブルは作成済みなので、本番では何もしない
if engine.dialect.name == "sqlite":
    Base.metadata.create_all(engine)

app = FastAPI(title="typing-app API")

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
