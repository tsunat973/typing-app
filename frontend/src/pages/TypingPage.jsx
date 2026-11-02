import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import CodeLine from "../components/CodeLine";
import { useGame } from "../context/GameContext";
import { useTyping } from "../hooks/useTyping";
import { calcWpm, calcAccuracy } from "../utils/calcStats";

const MOCK_PROBLEMS = [
  {
    id: 1,
    blocks: [
      {
        lang: "python",
        code: "nums = [1, 2, 3]\nfor n in nums:\n    print(n)",
      },
    ],
  },
  { id: 2, blocks: [{ lang: "python", code: "total = sum(nums)" }] },
];

// ミリ秒を「mm:ss」の文字列に変換する（例：42000 → "00:42"）
function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function TypingPage() {
  const t = useTyping(MOCK_PROBLEMS);
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

export default TypingPage;
