import { createContext, useContext, useState } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [lang, setLang] = useState("react");
  const [playerName, setPlayerName] = useState("");
  const [result, setResult] = useState(null);

  const value = {
    lang,
    setLang,
    playerName,
    setPlayerName,
    result,
    setResult,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame は GameProvider の中で使ってください");
  }
  return context;
}