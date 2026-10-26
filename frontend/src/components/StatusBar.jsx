import "./StatusBar.css";

function StatusBar({ left, right }) {
  return (
    <footer className="status-bar">
      <div className="status-group">{left}</div>
      <div className="status-group">{right}</div>
    </footer>
  );
}

export default StatusBar;