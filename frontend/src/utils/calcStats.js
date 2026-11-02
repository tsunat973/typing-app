// WPM = (正しく打った文字数 ÷ 5) ÷ 経過分数
// 英語の1単語を平均5文字として数える、タイピングの一般的な計算方法
export function calcWpm(typedCount, ms) {
  if (ms <= 0) return 0;
  const minutes = ms / 60000;
  return Math.round(typedCount / 5 / minutes);
}

// 正確率（%）= 正しく打った数 ÷（正しく打った数 + ミス数）× 100
// 小数第1位まで（例：96.5）
export function calcAccuracy(typedCount, missCount) {
  const total = typedCount + missCount;
  if (total === 0) return 100;
  return Math.round((typedCount / total) * 1000) / 10;
}