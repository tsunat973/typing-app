// ① Routes と Route を react-router-dom から import
import { Routes, Route } from "react-router-dom";

// ② 4つのページを import
import TopPage from "./pages/TopPage";
import TypingPage from "./pages/TypingPage";
import ResultPage from "./pages/ResultPage";
import RankingPage from "./pages/RankingPage";

// ③ App コンポーネント
function App() {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/typing" element={<TypingPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/ranking" element={<RankingPage />} />
    </Routes>
  );
}

export default App;``