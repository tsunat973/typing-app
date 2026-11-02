# テーブルの見取り図（詳細設計書 5.2・5.3）。Supabase 上のテーブルと同じ形に書く
from datetime import datetime

from sqlalchemy import JSON, CheckConstraint, DateTime, Index, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


# お題。通常モードは lang 必須、混合モードは lang が NULL
class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[int] = mapped_column(primary_key=True)
    mode: Mapped[str] = mapped_column(String(10), default="normal", server_default="normal")
    lang: Mapped[str | None] = mapped_column(String(10))
    title: Mapped[str | None] = mapped_column(String(50))
    # ブロックの配列 [{"lang": "python", "code": "..."}]。
    # 本番は JSONB だが、SQLite にはないので JSON 型で書く（どちらでも動く）
    blocks: Mapped[list] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # SQLite でも同じ制約が効くように、DDL の CHECK をここにも書く
    __table_args__ = (
        CheckConstraint("mode IN ('normal', 'mixed')"),
        CheckConstraint("lang IN ('react', 'python')"),
        CheckConstraint("(mode = 'normal' AND lang IS NOT NULL) OR (mode = 'mixed' AND lang IS NULL)"),
        Index("idx_problems_mode_lang", "mode", "lang"),
    )


# スコア。1プレイにつき1行（お題への外部キーは持たない）
class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20))
    mode: Mapped[str] = mapped_column(String(10), default="normal", server_default="normal")
    lang: Mapped[str] = mapped_column(String(10))
    wpm: Mapped[int] = mapped_column(Integer)
    # asdecimal=False: Decimal ではなく float で返す（JSON にそのまま出せる）
    accuracy: Mapped[float] = mapped_column(Numeric(5, 2, asdecimal=False))
    miss_count: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        # char_length は PostgreSQL 専用。length なら PostgreSQL と SQLite の両方で動く
        CheckConstraint("length(name) BETWEEN 1 AND 20"),
        CheckConstraint("mode IN ('normal', 'mixed')"),
        CheckConstraint("lang IN ('react', 'python')"),
        CheckConstraint("wpm >= 0"),
        CheckConstraint("accuracy BETWEEN 0 AND 100"),
        CheckConstraint("miss_count >= 0"),
    )


# ランキング用。wpm の高い順、同点は登録が早い順
Index("idx_scores_ranking", Score.wpm.desc(), Score.created_at.asc())
