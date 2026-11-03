# DB への接続まわり。ほかのファイルは、ここから engine / Session / Base を使う
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# backend/.env の中身を環境変数として読み込む（ファイルがなければ何もしない）
load_dotenv()

# 接続文字列。本番は Supabase（Session pooler）、未設定ならローカルの SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

# Supabase の文字列は postgresql:// で始まるが、SQLAlchemy で psycopg(v3) を使うには
# postgresql+psycopg:// と書く必要がある。ここで置き換えておく
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

# SQLite は、接続を作ったスレッド以外で使うとエラーにする。
# FastAPI は複数のスレッドで動くので、SQLite のときだけ許可する（PostgreSQL では不要）
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

# pool_pre_ping=True: 接続を使う前に生きているか確認する。
# 無料枠の DB は、しばらく使わないと接続が切れることがあるため
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

# Session を作る工場。get_db が、リクエストごとにここから1つ取り出す
SessionLocal = sessionmaker(bind=engine, autoflush=False)


# すべてのモデル（models.py の Problem, Score）の親クラス
class Base(DeclarativeBase):
    pass


# FastAPI の Depends で使う。リクエストの間だけ Session を渡し、終わったら必ず閉じる
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
