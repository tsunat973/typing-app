import StatusBar from "../components/StatusBar";
import { useGame } from "../context/GameContext";

function TopPage() {
    const {lang} = useGame();
  return (
    <div className="page">
      <div className="page-body">
        <h1>Top: {lang}</h1>
      </div>
      <StatusBar left="lang: react" right="時間制限なし" />
    </div>
  );
}
export default TopPage;
