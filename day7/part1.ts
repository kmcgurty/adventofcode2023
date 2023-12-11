import fs from "fs";

const CardMap = {
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 7,
    T: 8,
    J: 9,
    Q: 10,
    K: 11,
    A: 12,
};

enum HandType {
    "unknown" = -1,
    "highcard" = 0,
    "onepair" = 1,
    "twopair" = 2,
    "threeofakind" = 3,
    "fullhouse" = 4,
    "fourofakind" = 5,
    "fiveofakind" = 6,
}

type ICard = keyof typeof CardMap;
type IHand = string;
interface IPlay {
    hand: IHand;
    type: HandType;
    bid: number;
}

const fileData = fs.readFileSync(__dirname + "/input.txt").toString();
let plays = parsePlays(fileData);
plays.forEach(setHandType);
plays = sortPlays(plays);

console.log("total winnings:", calculateWinnings(plays));

function calculateWinnings(plays: IPlay[]) {
    let total = 0;
    plays.forEach((play, index) => {
        const multiplier = index + 1;
        const product = play.bid * multiplier;
        total += product;
    });

    return total;
}

function sortPlays(plays: IPlay[]): IPlay[] {
    return plays.sort((aPlay, bPlay) => {
        if (aPlay.type == bPlay.type) {
            return tieBreakerPlays(aPlay, bPlay);
        }

        return aPlay.type - bPlay.type;
    });
}

function setHandType(play: IPlay): void {
    if (isFiveOAK(play)) {
        play.type = HandType.fiveofakind;
    } else if (isFourOAK(play)) {
        play.type = HandType.fourofakind;
    } else if (isFullHouse(play)) {
        play.type = HandType.fullhouse;
    } else if (isThreeOAK(play)) {
        play.type = HandType.threeofakind;
    } else if (isTwoPair(play)) {
        play.type = HandType.twopair;
    } else if (isOnePair(play)) {
        play.type = HandType.onepair;
    }
}

function isHighCard(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    return uniqueCards.length === 5;
}

function isOnePair(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    return uniqueCards.length === 4;
}

function isTwoPair(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    return uniqueCards.length === 3 && !isThreeOAK(play);
}

function isThreeOAK(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    const threeUnique = uniqueCards.length === 3;

    if (!threeUnique) return false;

    const hand = play.hand.split("");
    const cFUnique = hand.filter((card) => card == uniqueCards[0]).length;
    const cSUnique = hand.filter((card) => card == uniqueCards[1]).length;
    const cTUnique = hand.filter((card) => card == uniqueCards[2]).length;

    const firstCondition = cFUnique == 3 || cFUnique == 1;
    const secondCondition = cSUnique == 3 || cSUnique == 1;
    const thirdCondition = cTUnique == 3 || cTUnique == 1;

    return firstCondition && secondCondition && thirdCondition;
}

function isFullHouse(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    return uniqueCards.length === 2 && !isFourOAK(play);
}

function isFourOAK(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    const twoUnique = uniqueCards.length === 2;

    if (!twoUnique) return false;

    const hand = play.hand.split("");
    const cFUnique = hand.filter((card) => card == uniqueCards[0]).length;
    const cSUnique = hand.filter((card) => card == uniqueCards[1]).length;

    const firstCondition = cFUnique == 1 || cFUnique == 4;
    const secondCondition = cSUnique == 1 || cSUnique == 4;

    return firstCondition && secondCondition;
}

function isFiveOAK(play: IPlay) {
    const uniqueCards = getUniqueCards(play);
    return uniqueCards.length === 1;
}

function getUniqueCards(play: IPlay) {
    let uniqueCards: ICard[] = [];

    for (let i = 0; i < play.hand.length; i++) {
        const card = play.hand[i] as ICard;
        if (!uniqueCards.includes(card)) {
            uniqueCards.push(card);
        }
    }

    return uniqueCards;
}

function tieBreakerPlays(play1: IPlay, play2: IPlay): number {
    const hand1 = play1.hand;
    const hand2 = play2.hand;

    for (let i = 0; i < hand1.length; i++) {
        const card1Val = CardMap[hand1[i]];
        const card2Val = CardMap[hand2[i]];

        if (card1Val > card2Val) {
            return 1;
        } else if (card2Val > card1Val) {
            return -1;
        }
    }

    return 0;
}

function parsePlays(fileData: string): IPlay[] {
    const lines = fileData.split(/\n/);
    return lines.map((line) => {
        const [hand, bid] = line.split(" ") as [unknown, string];
        return {
            hand: hand as IHand,
            type: HandType.unknown,
            bid: parseInt(bid),
        };
    });
}
