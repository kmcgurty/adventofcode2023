import fs from "fs";

interface IGearPos {
    row: number;
    col: number;
}

const fileData = fs.readFileSync("./input.txt").toString();
const dataSplit = fileData.split("\n");
const mapData = getMap2dArray(dataSplit);
let gears: Record<string, number[]> = {};
getParts(mapData);
console.log("Total: ", reduceGears());

function reduceGears() {
    let total = 0;
    const coords = Object.keys(gears);
    for (let i = 0; i < coords.length; i++) {
        const correctPartCount = gears[coords[i]].length === 2;
        if (!correctPartCount) {
            continue;
        }

        const product = gears[coords[i]][0] * gears[coords[i]][1];
        total += product;
    }

    return total;
}

function getParts(map: string[][]) {
    let foundGearPos: string | null = null;
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
                numEnd = col + 1;
            }

            if (currIsNum && !foundGearPos) {
                const config = {
                    checkTop: row > 0 && currIsNum,
                    checkBottom: row < map.length - 2 && currIsNum,
                    checkLeft: col !== 0 && !prevCharIsNum && isNumBeginning,
                    checkRight: col < map[row].length - 2 && isNumEnd,
                };
                const foundGear = checkForGear(row, col, map, config);
                if (foundGear !== null) {
                    foundGearPos = "" + foundGear.row + foundGear.col;
                }
            }

            if (isNumEnd && foundGearPos) {
                const partArray = map[row].slice(numStart, numEnd + 1);
                const partString = partArray.join("");
                const gearParts = gears[foundGearPos] ?? [];
                gearParts.push(parseInt(partString));

                gears[foundGearPos] = gearParts;
                foundGearPos = null;
            }
        }
    }
}

function checkForGear(
    row: number,
    col: number,
    map: string[][],
    config: {
        checkTop: boolean;
        checkBottom: boolean;
        checkLeft: boolean;
        checkRight: boolean;
    }
): IGearPos | null {
    let foundGearPos: IGearPos | null = null;

    if (config.checkTop) {
        foundGearPos = checkCoordsForGear(map, row - 1, col);
    }

    if (foundGearPos === null && config.checkLeft && config.checkTop) {
        foundGearPos = checkCoordsForGear(map, row - 1, col - 1);
    }

    if (foundGearPos === null && config.checkLeft) {
        foundGearPos = checkCoordsForGear(map, row, col - 1);
    }

    if (foundGearPos === null && config.checkLeft && config.checkBottom) {
        foundGearPos = checkCoordsForGear(map, row + 1, col - 1);
    }

    if (foundGearPos === null && config.checkBottom) {
        foundGearPos = checkCoordsForGear(map, row + 1, col);
    }

    if (foundGearPos === null && config.checkRight && config.checkBottom) {
        foundGearPos = checkCoordsForGear(map, row + 1, col + 1);
    }

    if (foundGearPos === null && config.checkRight) {
        foundGearPos = checkCoordsForGear(map, row, col + 1);
    }

    if (foundGearPos === null && config.checkRight && config.checkTop) {
        foundGearPos = checkCoordsForGear(map, row - 1, col + 1);
    }

    return foundGearPos;
}

function checkCoordsForGear(
    map: string[][],
    row: number,
    col: number
): IGearPos | null {
    if (map[row][col] == "*") {
        return {
            row,
            col,
        };
    }

    return null;
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
