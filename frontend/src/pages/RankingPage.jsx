import { useEffect, useState } from "react";
import StatusBar from "../components/StatusBar";
import { fetchRanking } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { lastScoreId } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRanking();
        setRanking(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-body">
        <h1>Ranking</h1>
        {loading && <p>読み込み中</p>}
        {error && <p>{error}</p>}
        {!loading && !error && ranking.length === 0 && <p>まだ記録がありません</p>}
        {ranking.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>順位</th>
                <th>名前</th>
                <th>WPM</th>
                <th>正確率</th>
                <th>日付</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((row) => (
                <tr key={row.id} className={row.id === lastScoreId ? "ranking-me" : ""}>
                  <td>{row.rank}</td>
                  <td>{row.name}</td>
                  <td>{row.wpm}</td>
                  <td>{Math.floor(row.accuracy)}%</td>
                  <td>{row.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={() => navigate("/")}>挑戦する</button >
      </div>
      <StatusBar left={`${ranking.length}件`} right="ranking" />
    </div>
  );
}


export default RankingPage;