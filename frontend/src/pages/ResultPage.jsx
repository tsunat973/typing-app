import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import { useGame } from "../context/GameContext";
import { postScore } from "../api/client";
import "./ResultPage.css";

function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function ResultPage() {
  const { result, lang, playerName, setPlayerName, setLastScoreId } = useGame();
  const [name, setName] = useState(playerName);
  const [status, setStatus] = useState("idle"); // idle → sending → done / error
  const [message, setMessage] = useState("");

  // 結果がまだないとき（1回もプレイしていない、再読み込みしたなど）
  if (!result) {
    return (
      <div className="page">
        <div className="page-body result">
          <p className="result-muted">$ cat result.log</p>
          <p className="result-muted">
            // まだ結果がありません。1回プレイすると、ここに表示されます
          </p>
          <nav className="result-links">
            <Link to="/">&gt; プレイする</Link>
            <Link to="/ranking">&gt; ランキング</Link>
          </nav>
        </div>
        <StatusBar left="result.log" right="結果なし" />
      </div>
    );
  }

  async function handleRegister(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 20) {
      setMessage("名前は1〜20文字で入力してください"); // E002
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await postScore({
        name: trimmed,
        mode: "normal",
        lang,
        wpm: result.wpm,
        accuracy: result.accuracy,
        miss_count: result.missCount,
      });
      setLastScoreId(res.id);
      setPlayerName(trimmed);
      setStatus("done");
      setMessage("ランキングに登録しました"); // I001
    } catch (err) {
      setStatus("error");
      setMessage(err.message); // E005
    }
  }

  const disabled = status === "sending" || status === "done";

  return (
    <div className="page">
      <div className="page-body result">
        <p className="result-muted">$ typing --lang {lang}</p>
        <p>
          <span className="result-ok">✓</span> 完了{" "}
          <span className="result-muted">（{formatTime(result.timeMs)}）</span>
        </p>

        <dl className="result-stats">
          <dt>wpm</dt>
          <dd className="result-wpm">{result.wpm}</dd>
          <dt>accuracy</dt>
          <dd>{Math.floor(result.accuracy)}%</dd>
          <dt>miss</dt>
          <dd className="result-miss">{result.missCount}</dd>
        </dl>

        <form className="result-form" onSubmit={handleRegister}>
          <label htmlFor="rank-name" className="result-muted">
            $ ranking add --name
          </label>
          <input
            id="rank-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
            maxLength={20}
            disabled={disabled}
          />
          <button type="submit" disabled={disabled}>
            {status === "sending" ? "登録中..." : "登録する"}
          </button>
        </form>
        {message && (
          <p
            className={
              status === "error" || status === "idle"
                ? "result-miss"
                : "result-ok"
            }
          >
            {message}
          </p>
        )}

        <nav className="result-links">
          <Link to="/typing">&gt; もう一度</Link>
          <Link to="/ranking">&gt; ランキング</Link>
          <Link to="/">&gt; トップ</Link>
        </nav>
      </div>
      <StatusBar
        left={lang}
        right={status === "done" ? "ランキング登録済み" : "ランキング未登録"}
      />
    </div>
  );
}

export default ResultPage;
