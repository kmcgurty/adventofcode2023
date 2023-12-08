import fs from "fs";
import path from "path";

console.log("Current directory:", __dirname);

const fileData = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
const rawCards = fileData.split("\n");

const cardNumbers = rawCards.map((r) => r.split(": ")[1]);
const copies: number[] = [];
const wins: number[] = cardNumbers.map((n) => {
    const [rawWinningSet, rawDrawnSet] = n.split(/ \| +/);

    const winning = rawWinningSet.split(/ +/);
    const drawn = rawDrawnSet.split(/ +/);

    const countWon = getCardWinningCount(drawn, winning);
    copies.push(1);
    return countWon;
});

let total = 0;
console.log(copies);
console.log(wins);
for (let i = 0; i < wins.length; i++) {
    for (let j = 1; j < wins[i] + 1; j++) {
        if (i + j > wins.length) break;
        copies[i + j] += copies[i];
    }
    total += copies[i];
}

console.log(total);

function getCardWinningCount(drawnCards: string[], winningCards: string[]) {
    let winningCount: number = 0;
    for (let i = 0; i < drawnCards.length; i++) {
        const drawn = drawnCards[i];
        const isDrawnWinning = winningCards.includes(drawn);

        if (isDrawnWinning) winningCount++;
    }

    return winningCount;
}
