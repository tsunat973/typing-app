import StatusBar from "../components/StatusBar";
import { useGame } from "../context/GameContext";

function isValidName(playerName) {
  const trimmedPlayerName = playerName.trim();
  return trimmedPlayerName.length >= 1 && trimmedPlayerName.length <= 20;
}

function TopPage() {
  const { lang, setLang, playerName, setPlayerName } = useGame();
  const nameOk = isValidName(playerName);

  return (
    <div className="page">
      <div className="page-body">
        <h1>Top: {lang}</h1>
        <p>言語の設定:</p>
        <button onClick={() => setLang("react")}>React</button>
        <button onClick={() => setLang("python")}>Python</button>

        <p>名前:</p>
        <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        {!nameOk && <p>名前は1〜20文字で入力してください</p>}
      </div>
      <StatusBar left={"lang: " + lang} right="時間制限なし" />
    </div>
  );
}
export default TopPage;
