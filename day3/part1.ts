import fs from "fs";

const fileData = fs.readFileSync("./input.txt").toString();
const dataSplit = fileData.split("\n");
const mapData = getMap2dArray(dataSplit);
let partList: number[] = [];
getParts(mapData);

console.log(
    "Total: ",
    partList.reduce((a, b) => a + b)
);

function getParts(map: string[][]) {
    let isPart = false;
    let numStart = 0;
    let numEnd = 0;
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            let currIsNum = isNumber(map[row][col]);
            let prevCharIsNum = col > 0 && isNumber(map[row][col - 1]);
            let isNumBeginning = !prevCharIsNum && currIsNum;
            let nextCharIsNum =
                col < map[row].length - 1 && isNumber(map[row][col + 1]);
            let isNumEnd = currIsNum && !nextCharIsNum;

            if (isNumBeginning) numStart = col;
            if (isNumEnd) {
                numEnd = col;
            }

            if (currIsNum && !isPart) {
                const config = {
                    checkTop: row > 0 && currIsNum,
                    checkBottom: row < map.length - 2 && currIsNum,
                    checkLeft: col !== 0 && !prevCharIsNum && isNumBeginning,
                    checkRight: col < map[row].length - 2 && isNumEnd,
                };
                isPart = checkForPart(row, col, map, config);
            }

            if (isNumEnd && isPart) {
                isPart = false;
                const partArray = map[row].slice(numStart, numEnd + 1);
                const partString = partArray.join("");
                partList.push(parseInt(partString));
            }
        }
    }
}

function checkForPart(
    row: number,
    col: number,
    map: string[][],
    config: {
        checkTop: boolean;
        checkBottom: boolean;
        checkLeft: boolean;
        checkRight: boolean;
    }
) {
    let isPart = false;

    if (config.checkTop) {
        isPart = isPartSymbol(map[row - 1][col]);
    }

    if (!isPart && config.checkLeft && config.checkTop) {
        isPart = isPartSymbol(map[row - 1][col - 1]);
    }

    if (!isPart && config.checkLeft) {
        isPart = isPartSymbol(map[row][col - 1]);
    }

    if (!isPart && config.checkLeft && config.checkBottom) {
        isPart = isPartSymbol(map[row + 1][col - 1]);
    }

    if (!isPart && config.checkBottom) {
        isPart = isPartSymbol(map[row + 1][col]);
    }

    if (!isPart && config.checkRight && config.checkBottom) {
        isPart = isPartSymbol(map[row + 1][col + 1]);
    }

    if (!isPart && config.checkRight) {
        isPart = isPartSymbol(map[row][col + 1]);
    }

    if (!isPart && config.checkRight && config.checkTop) {
        isPart = isPartSymbol(map[row - 1][col + 1]);
    }

    return isPart;
}

function isPartSymbol(char: string) {
    const test = char !== "." && !isNumber(char);
    return test;
}

function isNumber(str: string) {
    return !isNaN(Number(str));
}

function getMap2dArray(data: string[]) {
    let map: string[][] = [];
    for (let i = 0; i < data.length; i++) {
        const _2d = data[i].split("");
        map.push(_2d);
    }
    return map;
}
