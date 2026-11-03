import { useEffect, useReducer } from "react";
import { toChars } from "../utils/toChars";

// i 番目から、auto（自動で飛ばす文字）が続く間は飛ばして、次に打つ位置を返す
function skipAuto(chars, i) {
  while (i < chars.length && chars[i].auto) i++;
  return i;
}

// 最初の状態を作る
function init(problems) {
  const charsList = problems.map(toChars);
  return {
    charsList,                            // お題ごとの chars の配列
    problemIndex: 0,                      // 今何問目か（0から）
    cursor: skipAuto(charsList[0], 0),    // 今の問題の何文字目か
    typedCount: 0,                        // 正しく打った文字数（auto は数えない）
    missCount: 0,                         // ミスの回数
    isMiss: false,                        // 直前の入力がミスだったか
    startedAt: null,                      // 最初のキー入力の時刻
    finishedAt: null,                     // 全問終わった時刻
  };
}

function reducer(state, action) {
  if (action.type === "RESET") return init(action.problems);

  if (action.type === "KEY") {
    if (state.finishedAt) return state;   // 終わっていたら何もしない

    const chars = state.charsList[state.problemIndex];
    const expected = chars[state.cursor].ch;
    const startedAt = state.startedAt ?? action.time;

    if (action.key !== expected) {
      //ミスの場合
      return {
        ...state,
        startedAt,
        missCount: state.missCount + 1,
        isMiss: true,
      };
    }
    // ここから正解のとき
    const nextCursor = skipAuto(chars, state.cursor + 1);
    const base = { ...state, startedAt, typedCount: state.typedCount + 1, isMiss: false };

    // まだこの問題の途中なら（nextCursor < chars.length）
    //   cursor を nextCursor にした state を返す
    if (nextCursor < chars.length) {
      return {
        ...base,
        cursor: nextCursor,
      };
    }

    // この問題を打ち終えた。最後の問題だったら
    //（state.problemIndex が charsList.length - 1）
    // finishedAt に action.time を入れた state を返す
    if (state.problemIndex === state.charsList.length - 1) {
      return {
        ...base,
        finishedAt: action.time,
      };
    }
    // 次の問題へ
    // problemIndex を1進め、cursor を次の問題の最初の位置
    //（skipAuto(次の問題の chars, 0)）にした state を返す
    const nextProblemIndex = state.problemIndex + 1;
    const nextChars = state.charsList[nextProblemIndex];

    return {
      ...base,
      problemIndex: nextProblemIndex,
      cursor: skipAuto(nextChars, 0),
    };
  }
  return state;
}

export function useTyping(problems) {
  const [state, dispatch] = useReducer(reducer, problems, init);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;   // ショートカットは邪魔しない
      if (e.key === "Escape") {
        dispatch({ type: "RESET", problems });
        return;
      }
      let key;
      if (e.key === "Enter") key = "\n";
      else if (e.key.length === 1) key = e.key;         // 1文字のキーだけ（Shift などは除外）
      else return;
      e.preventDefault();                               // スペースでのスクロールなどを防ぐ
      dispatch({ type: "KEY", key, time: Date.now() });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [problems]);

  return {
    ...state,
    chars: state.charsList[state.problemIndex],
    total: state.charsList.length,
  };
}