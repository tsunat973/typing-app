import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import { fetchRanking } from "../api/client";
import { useGame } from "../context/GameContext";
import "./RankingPage.css";

// 日本時間の「11/05」の形にする
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });
}

function RankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { lastScoreId } = useGame();

  useEffect(() => {
    async function load() {
      try {
        setRanking(await fetchRanking());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const myRank = ranking.find((r) => r.id === lastScoreId)?.rank;

  return (
    <div className="page">
      <div className="page-body ranking">
        <p className="ranking-comment">// 全言語・WPM順・上位10件</p>
        {loading && <p className="ranking-comment">// 読み込み中...（初回は最大1分かかります）</p>}
        {error && <p className="ranking-error">{error}</p>}
        {!loading && !error && ranking.length === 0 && (
          <p className="ranking-comment">// まだ記録がありません</p>
        )}

        {ranking.length > 0 && (
          <div className="ranking-scroll">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">name</th>
                  <th scope="col" className="num">wpm</th>
                  <th scope="col" className="num">acc</th>
                  <th scope="col">lang</th>
                  <th scope="col" className="num">date</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((row) => {
                  const me = row.id === lastScoreId;
                  return (
                    <tr key={row.id} className={me ? "ranking-me" : undefined}>
                      <td className="ranking-rank">
                        {me ? `▶ ${row.rank}` : String(row.rank).padStart(2, "0")}
                      </td>
                      <td>{row.name}</td>
                      <td className="num ranking-wpm">{row.wpm}</td>
                      <td className="num ranking-sub">{Math.floor(row.accuracy)}%</td>
                      <td className="ranking-sub">{row.lang}</td>
                      <td className="num ranking-sub">{formatDate(row.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/" className="btn btn-primary">challenge()</Link>
      </div>
      <StatusBar
        left={`${ranking.length} 件`}
        right={myRank ? `あなた: ${myRank}位` : "ranking.txt"}
      />
    </div>
  );
}

export default RankingPage;