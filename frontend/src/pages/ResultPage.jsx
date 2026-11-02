import StatusBar from "../components/StatusBar";
import { useGame } from "../context/GameContext";

function ResultPage() {
  const { result } = useGame();
  return (
    <div className="page">
      <div className="page-body">
        <pre>{JSON.stringify(result)}</pre>
      </div>
      <StatusBar left="python" right="ランキング未登録" />
    </div>
  );
}

export default ResultPage;
