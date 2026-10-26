import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TopPage from "./pages/TopPage";
import TypingPage from "./pages/TypingPage";
import ResultPage from "./pages/ResultPage";
import RankingPage from "./pages/RankingPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/typing" element={<TypingPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;