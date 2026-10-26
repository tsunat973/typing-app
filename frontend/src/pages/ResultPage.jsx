import StatusBar from "../components/StatusBar";

function ResultPage() {
  return (
    <div className="page">
      <div className="page-body">
        <h1>Result</h1>
      </div>
      <StatusBar left="python" right="ランキング未登録" />
    </div>
  );
}

export default ResultPage;