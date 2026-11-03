export function toChars(problem) {
    const chars = [];
    let atLineStart = true;
    for (const block of problem.blocks) {
        for (const ch of block.code) {
            const auto = atLineStart && ch === " ";
            chars.push({ ch, lang: block.lang, auto });
            
            if (ch === "\n") {
                atLineStart = true;
            }
            else if (ch !== " ") {
                atLineStart = false;
            }
        }
    }
    return chars;
}