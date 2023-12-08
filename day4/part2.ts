import fs from "fs";
import path from "path";

interface ICard {
    winCount: number;
    copiesWon: number;
    winningCards: string[];
    drawnCards: string[];
}

console.log("Current directory:", __dirname);

const fileData = fs.readFileSync(path.join(__dirname, "input.txt")).toString();
const rawCards = fileData.split("\n");

const cardNumbers = rawCards.map((r) => r.split(": ")[1]);
const cards: ICard[] = cardNumbers.map((n) => {
    const [rawWinningSet, rawDrawnSet] = n.split(/ \| +/);

    const winning = rawWinningSet.split(/ +/);
    const drawn = rawDrawnSet.split(/ +/);

    return {
        winCount: -1,
        copiesWon: 0,
        winningCards: winning,
        drawnCards: drawn,
    };
});

getCardsWon();
const cardsWon = cards.reduce((total, card) => {
    return (total += card.copiesWon + 1);
}, 0);
console.log("total cards won: ", cardsWon);

function getCardsWon(cardIndex: number = 0, copiesToProcess: number = -1) {
    let originalCard = false;
    if (cards[cardIndex].winCount == -1) {
        cards[cardIndex].winCount = getCardWinningCount(cards[cardIndex]);
        originalCard = true;
        increaseCopiesWon(cardIndex + 1, cards[cardIndex].winCount);
    }

    if (copiesToProcess <= 0 || cards[cardIndex].winCount == 0) {
        cardIndex++;

        if (cardIndex >= cards.length) {
            return;
        }

        copiesToProcess = -1;
    } else if (!originalCard) {
        increaseCopiesWon(cardIndex + 1, cards[cardIndex].winCount);
        copiesToProcess--;
    }

    if (copiesToProcess == -1) {
        copiesToProcess = cards[cardIndex].copiesWon;
    }

    return getCardsWon(cardIndex, copiesToProcess);
}

function increaseCopiesWon(start: number, end: number) {
    for (let i = start; i < start + end && i < cards.length; i++) {
        cards[i].copiesWon++;
    }
}

function getCardWinningCount(card: ICard) {
    let winningCount: number = 0;
    for (let i = 0; i < card.drawnCards.length; i++) {
        const drawn = card.drawnCards[i];
        const isDrawnWinning = card.winningCards.includes(drawn);

        if (isDrawnWinning) winningCount++;
    }

    return winningCount;
}
