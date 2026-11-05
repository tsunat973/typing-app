// 接続先のURL（frontend/.env の VITE_API_URL）
const BASE_URL = import.meta.env.VITE_API_URL;

// エラーメッセージ
const E004 = "サーバーでエラーが発生しました。時間をおいて再度お試しください";
const E005 = "通信に失敗しました。接続を確認してください";

// 3つの関数で共通の頼みに行く処理
async function request(path, options) {
    let res;
    try {
        res = await fetch(BASE_URL + path, options);
    } catch {
        // サーバーにつながらなかった場合
        throw new Error(E005);
    }

    // 返事の中身を JSON として読む,読めなければ nullを返す
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        // つながったけど、サーバーがエラーを返してきた
        const fallback = res.status >= 500 ? E004 : E005;
        throw new Error(data?.error?.message ?? fallback);
    }
    return data;
}

//お題を取得する
export async function fetchProblems(mode = "normal", lang) {
    const params = new URLSearchParams({ mode });
    if (lang) params.append("lang", lang);
    return request(`/api/problems?${params}`);
}

//スコアを保存する
export async function postScore(score) {
    return request("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(score),
    });
}

//ランキングを取得する
export async function fetchRanking() {
    return request("/api/ranking");
}