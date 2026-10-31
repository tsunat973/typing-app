import StatusBar from "../components/StatusBar";

function TypingPage() {
  return (
    <div className="page">
      <div className="page-body">
        <h1>Typing</h1>
      </div>
      <StatusBar
        left={
          <>
            <span>python</span>
            <span>3 / 10</span>
          </>
        }
        right={
          <>
            <span>00:42</span>
            <span>58 wpm</span>
            <span>miss 2</span>
            <span>Esc: リスタート</span>
          </>
        }
      />
    </div>
  );
}

export default TypingPage;