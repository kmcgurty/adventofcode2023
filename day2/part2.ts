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

const fileData = fs.readFileSync("./input.txt").toString();
const rawGames = fileData.split("\r\n");
const t0 = performance.now();
const games = formatGames(rawGames);
let powerSum = 0;

for (let i = 0; i < games.length; i++) {
    const { id, rounds } = games[i];
    const min: IRound = {
        red: 1,
        green: 1,
        blue: 1,
    };

    for (let j = 0; j < rounds.length; j++) {
        const { red, green, blue } = rounds[j];
        if (red > min.red) min.red = red;
        if (green > min.green) min.green = green;
        if (blue > min.blue) min.blue = blue;
    }

    const power = min.red * min.green * min.blue;
    powerSum += power;
}

const t1 = performance.now();
const elapsed = (t1 - t0).toFixed(2);

console.log("Answer: ", powerSum, "Finished in:", elapsed, "ms");

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
