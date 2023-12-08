import fs from "fs";

const fileData = fs.readFileSync("./input.txt").toString();
const rawCards = fileData.split("\n");

const cardNumbers = rawCards.map((r) => r.split(": ")[1]);
const cards = cardNumbers.map((n) => {
    const [rawWinningSet, rawDrawnSet] = n.split(/ \| +/);

    const winning = rawWinningSet.split(/ +/);
    const drawn = rawDrawnSet.split(/ +/);

    return {
        winning,
        drawn,
    };
});

const winningCards: number[][] = [];
for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const cardWinningNumbers: number[] = [];
    for (let j = 0; j < card.drawn.length; j++) {
        const drawn = card.drawn[j];
        const isDrawnWinning = card.winning.includes(drawn);

        if (isDrawnWinning) cardWinningNumbers.push(parseInt(drawn));
    }
    winningCards.push(cardWinningNumbers);
}
console.log("winning cards", winningCards);
let totalPoints = winningCards.reduce((prevTotal, card) => {
    const cardTotal = calcPoints(card);
    return (prevTotal += cardTotal);
}, 0);
console.log(totalPoints);

function calcPoints(winningNumbers: number[]) {
    const length = winningNumbers.length - 1;
    if (length < 0) return 0; // clamp to > 0
    return Math.pow(2, winningNumbers.length - 1);
}
