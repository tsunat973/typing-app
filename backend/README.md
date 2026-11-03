# backend

エンジニア向けタイピングアプリのバックエンド（FastAPI）。`backend/` で作業する。

## 起動

```bash
python -m venv .venv && source .venv/bin/activate   # 初回のみ
pip install -r requirements.txt                      # 初回のみ
cp .env.example .env                                 # 初回のみ。DATABASE_URL を設定する
```

### 手元で動かす（普通はこちら）

手元の SQLite（`dev.db`）につないで動かす。本番の Supabase には触れない。

```bash
DATABASE_URL=sqlite:///./dev.db uvicorn app.main:app --reload --port 8000
```

`http://localhost:8000/docs` で、3つの API を試せる。

> **注意**: `DATABASE_URL=sqlite:///./dev.db` を付けずに起動すると、`.env` の接続先（本番の Supabase）につながる。`/docs` で POST すると、本番の DB にテスト用のスコアが入るので、必ず付ける。

## 環境変数

| 名前 | 内容 | 例 |
| --- | --- | --- |
| `DATABASE_URL` | DB の接続文字列。未設定なら `sqlite:///./dev.db` | 本番は Supabase の Session pooler の文字列 |
| `CORS_ORIGINS` | 許可するフロントの URL（本番の Vercel）。カンマ区切り、末尾の `/` は付けない。`http://localhost:5173` は常に許可される | `https://<your-app>.vercel.app` |

`.env` は GitHub に上げない（見本は `.env.example`）。
