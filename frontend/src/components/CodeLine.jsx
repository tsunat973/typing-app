import "./CodeLine.css";

// chars を行ごとの配列に分ける。各文字に、全体での番号（index）を付けておく
function toLines(chars) {
  const lines = [[]];
  chars.forEach((c, index) => {
    lines[lines.length - 1].push({ ...c, index });
    if (c.ch === "\n") lines.push([]); // 改行の後から新しい行
  });
  return lines;
}

// 1文字に付ける class 名を返す
//   index < cursor                 → "typed"（入力済み）
//   index === cursor かつ isMiss   → "cursor miss"
//   index === cursor               → "cursor"
//   それ以外                        → "untyped"（未入力）
function charClass(index, cursor, isMiss) {
  if (index < cursor) return "typed";
  if (index === cursor && isMiss) return "cursor miss";
  if (index === cursor) return "cursor";
  return "untyped";
}

function CodeLine({ chars, cursor, isMiss }) {
  const lines = toLines(chars);

  return (
    <div className="code">
      {lines.map((line, lineNo) => {
        const isCurrent = line.some((c) => c.index === cursor);
        return (
          <div
            key={lineNo}
            className={isCurrent ? "code-line current" : "code-line"}
          >
            <span className="code-gutter">{lineNo + 1}</span>
            <span className="code-text">
              {line.map((c) => (
                <span
                  key={c.index}
                  className={charClass(c.index, cursor, isMiss)}
                >
                  {c.ch === "\n" ? "↵" : c.ch}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default CodeLine;
