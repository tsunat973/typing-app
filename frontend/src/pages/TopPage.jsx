import StatusBar from "../components/StatusBar";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom"

function isValidName(playerName) {
  const trimmedPlayerName = playerName.trim();
  return trimmedPlayerName.length >= 1 && trimmedPlayerName.length <= 20;
}

function TopPage() {
  const { lang, setLang, playerName, setPlayerName } = useGame();
  const nameOk = isValidName(playerName);
  const navigate=useNavigate();

  return (
    <div className="page">
      <div className="page-body">
        <p>言語の設定:</p>
        <button onClick={() => setLang("react")}>React</button>
        <button onClick={() => setLang("python")}>Python</button>

        <p>名前:</p>
        <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        {playerName !== "" && !nameOk && <p>名前は1〜20文字で入力してください</p>}
        <button disabled={!nameOk} onClick={()=>navigate("/typing")}>スタート</button>
      </div>
      <StatusBar left={"lang: " + lang} right="時間制限なし" />
    </div>
  );
}
export default TopPage;
