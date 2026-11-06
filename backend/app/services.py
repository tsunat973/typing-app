# DB を操作する処理をまとめる場所。ルーターからは、ここの関数を呼ぶだけにする
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Problem, Score
from app.schemas import RankingItem, ScoreCreate

# 通常モードで一度に出すお題の数、ランキングに載せる件数
PROBLEM_COUNT = 5
RANKING_LIMIT = 10


class ProblemService:
    # db は「DB との会話の窓口」（Session）。ルーターが Depends(get_db) で受け取って渡す
    def __init__(self, db: Session):
        self.db = db

    # 通常モード: 指定した言語のお題を、ランダムに5問返す
    def get_normal(self, lang: str) -> list[Problem]:
        stmt = (
            select(Problem)
            .where(Problem.mode == "normal", Problem.lang == lang)
            .order_by(func.random())  # PostgreSQL と SQLite の両方で「ランダム順」になる
            .limit(PROBLEM_COUNT)
        )
        return list(self.db.scalars(stmt))

    # 混合モード: 混合モードのお題をすべて返す
    def get_mixed(self) -> list[Problem]:
        stmt = select(Problem).where(Problem.mode == "mixed")
        return list(self.db.scalars(stmt))


class ScoreService:
    def __init__(self, db: Session):
        self.db = db

    # スコアを1件保存して、保存した行（id と created_at が入っている）を返す
    def create(self, data: ScoreCreate) -> Score:
        # 受け取った値から、DB に入れる1行ぶんのオブジェクトを作る
        score = Score(**data.model_dump())
        self.db.add(score)  # 注文票に書く
        self.db.commit()  # 正式に保存する
        self.db.refresh(score)  # DB が決めた id と created_at を読み直す
        return score

    # 通常モードのランキング: WPM が高い順。WPM が同点なら正確率が高い順、
    # それも同点なら登録が早い順で、上位10件
    def get_ranking(self) -> list[RankingItem]:
        stmt = (
            select(Score)
            .where(Score.mode == "normal")
            .order_by(Score.wpm.desc(), Score.created_at.asc())
            .limit(RANKING_LIMIT)
        )
        scores = self.db.scalars(stmt)
        # rank は DB にない列なので、並んだ順に 1, 2, 3... と付ける
        return [
            RankingItem(
                rank=rank,
                id=s.id,
                name=s.name,
                wpm=s.wpm,
                accuracy=s.accuracy,
                lang=s.lang,
                created_at=s.created_at,
            )
            for rank, s in enumerate(scores, start=1)
        ]
