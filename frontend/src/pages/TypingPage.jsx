import StatusBar from "../components/StatusBar";
import { useTyping } from "../hooks/useTying";
import CodeLine from "../components/CodeLine";

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

function TypingPage() {
  const t = useTyping(MOCK_PROBLEMS);
  
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
            <span>00:42</span>
            <span>58 wpm</span>
            <span>miss {t.missCount}</span>
            <span>Esc: リスタート</span>
          </>
        }
      />
    </div>
  );
}

export default TypingPage;
