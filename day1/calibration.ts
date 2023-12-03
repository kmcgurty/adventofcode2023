import fs from "fs";

const Map = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

const fileData = fs.readFileSync("./input.txt").toString();
const input = fileData.split("\r\n");

const t0 = performance.now();
let summed = 0;

for (let i = 0; i < input.length; i++) {
    const firstDigit = extractNumber(input[i], false);
    const lastDigit = extractNumber(input[i], true);
    const combined = parseInt([firstDigit, lastDigit].join());
    summed += combined;
}

const t1 = performance.now();
const elapsed = (t1 - t0).toFixed(2);

console.log("Total values: ", summed, "Time took: ", t1 - t0);

function extractNumber(word: string, reverse: boolean) {
    const wordArray = word.split("");
    let value: number | undefined;
    let mapKeys = Object.keys(Map);

    function shouldEnd(i: number) {
        if (reverse) {
            return i >= 0;
        } else {
            return i < wordArray.length;
        }
    }

    const startPosition = reverse ? wordArray.length : 0;

    for (let i = startPosition; shouldEnd(i); reverse ? i-- : i++) {
        for (let j = 0; j < mapKeys.length; j++) {
            const key = mapKeys[j];
            const slicedWord = word.slice(i, i + key.length);
            if (slicedWord == key) {
                value = Map[key];
                break;
            }
        }

        if (value !== undefined) break;

        const num = parseInt(wordArray[i]);

        if (!Number.isNaN(num)) {
            value = num;
            break;
        }
    }

    return value;
}
