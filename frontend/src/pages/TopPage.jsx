import StatusBar from "../components/StatusBar";

function TopPage() {
  return (
    <div className="page">
      <div className="page-body">
        <h1>Top</h1>
      </div>
      <StatusBar left="lang: react" right="時間制限なし" />
    </div>
  );
}
export default TopPage;
