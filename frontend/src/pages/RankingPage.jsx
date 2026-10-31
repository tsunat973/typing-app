import StatusBar from "../components/StatusBar";

function RankingPage() {
  return (
    <div className="page">
      <div className="page-body">
        <h1>Ranking</h1>
      </div>
      <StatusBar left="10 件" right="あなた: 4位" />
    </div>
  );
}

export default RankingPage;