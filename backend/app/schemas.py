# API の入口（リクエスト）と出口（レスポンス）の形と条件（基本設計書 7章）
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

# 使える値。範囲外の値は、ここで自動的に弾かれる
Lang = Literal["react", "python"]
Mode = Literal["normal", "mixed"]

# スコアの上限。DB の int4（約21億）を超える値で保存に失敗する（500 になる）のを防ぐ。
# 人間が打てる範囲より十分大きく、通常のプレイでは超えない値にしている
MAX_WPM = 1000
MAX_MISS_COUNT = 100000


# --- API-02 POST /api/scores ---

# 受け取る値。条件に合わないものは、サービスに渡す前に弾く
class ScoreCreate(BaseModel):
    # 名前の前後の空白を取ってから、長さを調べる（"  " だけの名前は1文字未満になって弾かれる）
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=20)
    mode: Mode = "normal"
    lang: Lang
    wpm: int = Field(ge=0, le=MAX_WPM)  # ge=0 は「0以上」、le は「以下」
    accuracy: float = Field(ge=0, le=100)  # le=100 は「100以下」
    miss_count: int = Field(ge=0, le=MAX_MISS_COUNT)


# 保存したあとに返す値
class ScoreCreated(BaseModel):
    # DB のモデル（Score）のオブジェクトから、そのまま作れるようにする
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


# --- API-01 GET /api/problems ---

# お題を構成する1ブロック。混合モードでは javascript も入るので、lang は str にしている
class Block(BaseModel):
    lang: str
    code: str


class ProblemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mode: str
    title: str | None
    blocks: list[Block]


# --- API-03 GET /api/ranking ---

# ランキングの1行。rank は DB にない列なので、サービスで順位を付けて作る
class RankingItem(BaseModel):
    rank: int
    id: int  # 画面で、直前に登録した行を強調するために返す
    name: str
    wpm: int
    accuracy: float
    lang: str
    created_at: datetime
