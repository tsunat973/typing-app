import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import CodeLine from "../components/CodeLine";
import { useGame } from "../context/GameContext";
import { useTyping } from "../hooks/useTyping";
import { calcWpm, calcAccuracy } from "../utils/calcStats";
import { fetchProblems } from "../api/client";

// ミリ秒を「mm:ss」の文字列に変換する（例：42000 → "00:42"）
function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function TypingGame({problems}) {
  const t = useTyping(problems);
  const navigate = useNavigate();
  const { setResult } = useGame();
  const [now, setNow] = useState(() => Date.now());

  // 打ち始めてから終わるまでの間だけ、0.1秒ごとに now を更新する
  useEffect(() => {
    if (!t.startedAt || t.finishedAt) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [t.startedAt, t.finishedAt]);

  // 経過時間：打ち始める前は0、終わったら終了時刻で止める
  const elapsed = t.startedAt ? (t.finishedAt ?? now) - t.startedAt : 0;
  const wpm = calcWpm(t.typedCount, elapsed);

  // 全問を打ち終えたら、結果を保存して結果画面へ
  useEffect(() => {
    if (!t.finishedAt) return;
    const timeMs = t.finishedAt - t.startedAt;
    setResult({
      wpm: calcWpm(t.typedCount, timeMs),
      accuracy: calcAccuracy(t.typedCount, t.missCount),
      missCount: t.missCount,
      timeMs,
    });
    navigate("/result");
  }, [t.finishedAt, t.startedAt, t.typedCount, t.missCount, setResult, navigate]);

  return (
    <div className="page">
      <div className="page-body">
        <CodeLine chars={t.chars} cursor={t.cursor} isMiss={t.isMiss} />
      </div>
      <StatusBar
        left={
          <>
            <span>{t.chars[t.cursor]?.lang}</span>
            <span>{t.problemIndex + 1} / {t.total}</span>
          </>
        }
        right={
          <>
            <span>{formatTime(elapsed)}</span>
            <span>{wpm} wpm</span>
            <span>miss {t.missCount}</span>
            <span>Esc: リスタート</span>
          </>
        }
      />
    </div>
  );
}

// お題を読み込んでから TypingGame を表示する
function TypingPage() {
  const { lang } = useGame();
  const [problems, setProblems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchProblems("normal", lang)
      .then((data) => { if (!ignore) setProblems(data); })
      .catch((e) => { if (!ignore) setError(e.message); });
    return () => { ignore = true; };
  }, [lang]);

  if (error) return <p className="page-body">{error}</p>;
  if (!problems) return <p className="page-body">// お題を読み込み中...（初回は最大1分かかります）</p>;
  if (problems.length === 0) return <p className="page-body">// お題がありません</p>;
  return <TypingGame problems={problems} />;
}

export default TypingPage;
