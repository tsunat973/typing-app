import { useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import { useGame } from "../context/GameContext";
import "./TopPage.css";

const LANGS = ["react", "python"];

function isValidName(playerName) {
  const trimmed = playerName.trim();
  return trimmed.length >= 1 && trimmed.length <= 20;
}

function TopPage() {
  const { lang, setLang, playerName, setPlayerName } = useGame();
  const nameOk = isValidName(playerName);
  const navigate = useNavigate();

  // ボタンでも Enter でもスタートできるように、form の送信で開始する
  function handleStart(e) {
    e.preventDefault();
    if (nameOk) navigate("/typing");
  }

  return (
    <div className="page">
      <form className="page-body editor" onSubmit={handleStart}>
        <div className="editor-line">
          <span className="editor-gutter">1</span>
          <span className="editor-comment">// 打ち込みジム</span>
        </div>
        <div className="editor-line">
          <span className="editor-gutter">2</span>
          <span className="editor-comment">// 記号もインデントも、時間制限なしで練習できるタイピング</span>
        </div>
        <div className="editor-line">
          <span className="editor-gutter">3</span>
        </div>
        <div className="editor-line">
          <span className="editor-gutter">4</span>
          <span className="editor-code"><span className="editor-keyword">const</span> lang =</span>
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              className={l === lang ? "btn btn-primary" : "btn"}
              aria-pressed={l === lang}
              onClick={() => setLang(l)}
            >
              "{l}"
            </button>
          ))}
        </div>
        <div className="editor-line">
          <span className="editor-gutter">5</span>
          <label htmlFor="player-name" className="editor-code">
            <span className="editor-keyword">const</span> name =
          </label>
          <span className="editor-group">
            <span className="editor-string">"</span>
            <input
              id="player-name"
              className="editor-input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="名前を入力"
              maxLength={20}
              autoComplete="off"
            />
            <span className="editor-string">"</span>;
          </span>
        </div>
        <div className="editor-line">
          <span className="editor-gutter">6</span>
          {playerName !== "" && !nameOk && (
            <span className="editor-error">// 名前は1〜20文字で入力してください</span>
          )}
        </div>
        <div className="editor-line">
          <span className="editor-gutter">7</span>
          <button type="submit" className="btn btn-primary" disabled={!nameOk}>
            start()
          </button>
          <span className="editor-comment">// Enter でも開始</span>
        </div>
      </form>
      <StatusBar left={`lang: ${lang}`} right="時間制限なし · 1プレイ5問" />
    </div>
  );
}

export default TopPage;