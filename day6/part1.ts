import fs from "fs";

interface IRace {
    timeLimit: number;
    record: number;
}

const example: IRace[] = [
    {
        timeLimit: 7,
        record: 9,
    },
    {
        timeLimit: 15,
        record: 40,
    },
    {
        timeLimit: 30,
        record: 200,
    },
];

const input: IRace[] = [
    {
        timeLimit: 42,
        record: 308,
    },
    {
        timeLimit: 89,
        record: 1170,
    },
    {
        timeLimit: 91,
        record: 1291,
    },
    {
        timeLimit: 89,
        record: 1467,
    },
];

let multiplied = 1;

for (let i = 0; i < input.length; i++) {
    let race = input[i];
    let speed = 0;
    let distanceTraveled = 0;
    let waysToWin = 0;

    console.log("starting race:", i);
    for (let buttonLength = 1; buttonLength < race.timeLimit; buttonLength++) {
        for (let timeElapsed = 0; timeElapsed < race.timeLimit; timeElapsed++) {
            if (timeElapsed < buttonLength) {
                speed++;
                continue;
            }

            distanceTraveled += speed;
        }

        if (distanceTraveled > race.record) waysToWin++;

        speed = 0;
        distanceTraveled = 0;
    }

    console.log(`race ${i}, has ${waysToWin} ways to win`);
    multiplied *= waysToWin;
}

console.log(`Final answer is ${multiplied}`);
