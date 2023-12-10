import fs from "fs";

interface IRace {
    timeLimit: number;
    record: number;
}

const example: IRace = {
    timeLimit: 71530,
    record: 940200,
};

const input: IRace = {
    timeLimit: 42899189,
    record: 308117012911467,
};

let race = input;
let speed = 0;
//let distanceTraveled = 0;
let waysToWin = 0;
let lossCount = 0;
let minThreshold = false;

console.log("starting race");
for (let buttonLength = 0; buttonLength <= race.timeLimit; buttonLength++) {
    let distanceTraveled = buttonLength * (race.timeLimit - buttonLength);

    // console.log(
    //     buttonLength,
    //     race.timeLimit,
    //     race.record,
    //     distanceTraveled > race.record
    // );
    if (distanceTraveled > race.record) {
        waysToWin++;
    }

    //speed = 0;
    //distanceTraveled = 0;
}

console.log(`race has ${waysToWin} ways to win`);
