const rankingData = [
    { rank: 1, id: 15, name: "しげ", wpm: 62, accuracy: 96.5, lang: "react", created_at: "2026-11-01T12:34:56Z" },
    { rank: 2, id: 8, name: "がく", wpm: 55, accuracy: 94.0, lang: "python", created_at: "2026-11-01T10:00:00Z" },
    { rank: 3, id: 21, name: "Jacob", wpm: 48, accuracy: 91.2, lang: "react", created_at: "2026-11-01T15:20:00Z" },
];

const problems = [
    { id: 1, mode: "normal", title: null, lang: "python", blocks: [{ lang: "python", code: "total = 0\nfor n in nums:\n    total += n" }] },
    { id: 2, mode: "normal", title: null, lang: "react", blocks: [{ lang: "react", code: "Reactのコード" }] },
    { id: 3, mode: "mixed", title: "example", lang: null, blocks: [{ lang: "python", code: "example2" }, { lang: "react", code: "Reactのコード" }] }
];

export async function fetchRanking() {
    return rankingData;
}



export async function fetchProblems(mode, lang) {
    const matchedProblems = [];
    for (const pro of problems) {
        if (pro.mode === mode && pro.lang === lang) {
            matchedProblems.push(pro);
        } else if (mode === "mixed" && pro.mode === mode) {
            matchedProblems.push(pro);
        }
    }
    return matchedProblems;
}

export async function postScore(score) {
    console.log(score);
    return { id: 2, created_at: "2026-12-02T22:20:10Z" };
}