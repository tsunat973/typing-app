# 打ち込みジム

**記号もインデントも、時間制限なしで練習できる、プログラミング初学者向けのタイピングアプリ**です。

- 本番: https://<本番のURL>.vercel.app
- API: https://typing-app-d9q0.onrender.com （初回アクセス時は、サーバーの起動に1分ほどかかります）

サポーターズのハッカソン（2026年11月）で、3人のチームで開発しました。

## 作った理由

- 一般的なタイピングサイトでは、`{ } ( ) => ;` のような、コード特有の記号を練習できない
- コード向けのサイトは時間制限があり、時間に追われてまともに練習できない
- コード向けのサイトの多くは英語のみで、日本語で学ぶ初学者には使いにくい

## 主な機能

| 機能 | 内容 |
| --- | --- |
| 言語の選択 | React（JSX）と Python から選べる（各20問、1プレイ5問をランダムに出題） |
| 時間制限なし | 経過時間は計測するが、制限はない。正確に打つことに集中できる |
| 複数行のお題 | 行末は Enter で改行。次の行のインデントは自動で飛ばす（打たなくてよい） |
| 入力判定 | 1文字ずつ判定し、正しいキーを押すまで先に進まない。入力済み・ミス・未入力・カーソルを色で区別 |
| 結果 | WPM・正確率・ミス数・タイムを表示（自動で飛ばしたインデントは WPM に数えない） |
| ランキング | 全体の上位10件を WPM 順に表示（同じ WPM なら正確率の高い順）。直前に登録した自分の記録を強調する |

ログインは不要で、名前を入力するだけで遊べます。

## 技術構成

```
ブラウザ
  │  React 19 + Vite（Vercel）
  │  REST / JSON
  ▼
FastAPI（Render）
  │  SQLAlchemy
  ▼
PostgreSQL（Supabase）
```

| 区分 | 使ったもの |
| --- | --- |
| フロントエンド | React 19、React Router 7、Vite |
| バックエンド | Python、FastAPI、SQLAlchemy、Pydantic |
| データベース | Supabase（PostgreSQL）。ローカル開発は SQLite |
| デプロイ | Vercel（フロント）、Render（バック） |

## API

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/api/problems?mode=normal&lang=python` | 指定した言語のお題を5問返す |
| POST | `/api/scores` | スコアを保存する |
| GET | `/api/ranking` | ランキングの上位10件を返す |

エラーは `{ "error": { "code": "E002", "message": "..." } }` の形で返します。

## ディレクトリ構成

```
typing-app/
├── frontend/              React（Vite）
│   └── src/
│       ├── pages/         Top / Typing / Result / Ranking の4画面
│       ├── components/    Header、StatusBar、CodeLine（お題の色分け表示）
│       ├── hooks/         useTyping（入力判定・インデントの自動スキップ）
│       ├── context/       GameContext（画面をまたいで使う値）
│       ├── api/           client.js（API の呼び出し）
│       └── utils/         toChars（お題を1文字ずつの配列に変換）、calcStats（WPM・正確率）
└── backend/               FastAPI
    ├── app/               main.py、models.py、schemas.py、services.py、routers/
    └── seed.sql           お題の初期データ（Python 20問・React 20問）
```

## ローカルで動かす

### バックエンド

[backend/README.md](backend/README.md) を参照してください。手元の SQLite で起動すると、`http://localhost:8000/docs` で API を試せます。

### フロントエンド

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL にバックエンドの URL を書く
npm run dev             # http://localhost:5173
```

| 環境変数 | 内容 | 例 |
| --- | --- | --- |
| `VITE_API_URL` | バックエンドの URL（末尾の `/` は付けない） | `http://localhost:8000` |

`.env` は GitHub に上げません（見本は `.env.example`）。

## チーム

| メンバー | 担当 |
| --- | --- |
| がく | リーダー、トップ画面・ランキング画面、API の呼び出し、お題の作成、発表 |
| Jacob | バックエンド（FastAPI・Supabase）、Render へのデプロイ |
| しげ | プログラミングリーダー、フロントの土台・タイピング画面・結果画面・デザイン、Vercel へのデプロイ |