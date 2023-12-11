import fs from "fs";

const CardMap = {
    J: 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
    "8": 7,
    "9": 8,
    T: 9,
    Q: 11,
    K: 12,
    A: 13,
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
    } else if (isHighCard(play)) {
        play.type = HandType.highcard;
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

    const hand = upgradeJokerHand(play).split("");
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

    const hand = upgradeJokerHand(play).split("");
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

function upgradeJokerHand(play: IPlay) {
    let hand = play.hand.split("");
    let counts: {
        card: string;
        count: number;
    }[] = [];

    hand.forEach((card) => {
        const index = counts.findIndex((val) => val.card == card);
        if (index == -1) {
            counts.push({
                card,
                count: 1,
            });
        } else {
            counts[index].count++;
        }
    });

    counts = counts.sort((a, b) => {
        return b.count - a.count;
    });

    const mostNonJ = counts.find((val) => {
        return val.card !== "J";
    });

    //do something here where the whole card is J?
    if (mostNonJ == undefined) return play.hand;

    const upgraded = hand
        .map((val) => {
            if (val == "J") {
                return mostNonJ.card;
            }

            return val;
        })
        .join("");

    return upgraded;
}

function getUniqueCards(play: IPlay) {
    const upgradedHand = upgradeJokerHand(play);
    let uniqueCards: ICard[] = [];

    for (let i = 0; i < upgradedHand.length; i++) {
        const card = upgradedHand[i] as ICard;
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
