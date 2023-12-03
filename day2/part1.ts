import fs from "fs";

interface IRound {
    red: number;
    green: number;
    blue: number;
}

type GameRounds = [IRound, IRound, IRound];

interface IGame {
    id: number;
    rounds: GameRounds;
}

const test: IRound = {
    red: 12,
    green: 13,
    blue: 14,
};

const fileData = fs.readFileSync("./input.txt").toString();
const rawGames = fileData.split("\r\n");
const games = formatGames(rawGames);
let sum = 0;

for (let i = 0; i < games.length; i++) {
    const { id, rounds } = games[i];
    let isGamePossible = true;
    for (let j = 0; j < rounds.length; j++) {
        const { red, green, blue } = rounds[j];
        const isRoundPossible =
            red <= test.red && blue <= test.blue && green <= test.green;
        if (!isRoundPossible) {
            isGamePossible = false;
            break;
        }
    }

    if (isGamePossible) {
        sum += id;
    }
}

console.log(sum);

function formatGames(rawLines: string[]): IGame[] {
    return rawLines.map((line, index) => {
        const [rawGame, rawRounds] = line.split(": ");
        const rounds = extractRounds(rawRounds);

        return {
            id: index + 1,
            rounds,
        };
    });
}

function extractRounds(rawRounds: string): GameRounds {
    const rawRoundsSplit = rawRounds.split("; ");
    return rawRoundsSplit.map((rawRound) => {
        const round: IRound = {
            red: 0,
            green: 0,
            blue: 0,
        };

        const rawColors = rawRound.split(", ");
        for (let i = 0; i < rawColors.length; i++) {
            const [rawCount, color] = rawColors[i].split(" ");
            const count = parseInt(rawCount);

            if (color.includes("red")) {
                round.red += count;
            } else if (color.includes("green")) {
                round.green += count;
            } else if (color.includes("blue")) {
                round.blue += count;
            }
        }

        return round;
    }) as GameRounds;
}
