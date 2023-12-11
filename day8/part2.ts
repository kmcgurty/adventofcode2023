import fs from "fs";

type IMap = Record<
    string,
    {
        R: string;
        L: string;
    }
>;

const fileData = fs.readFileSync(__dirname + "/input.txt").toString();
const data = fileData.split(/\n/);

const directions = data[0].split("");
const rawMap = data.slice(2);
let map: IMap = {};

rawMap.forEach((val) => {
    const split = val.split(" = (");
    const location = split[0];
    const LR = split[1].split(", ");
    const L = LR[0];
    const R = LR[1].slice(0, -1);
    map[location] = {
        L,
        R,
    };
});

let currentLocations: string[] = [];

const allLocations = Object.keys(map);
allLocations.forEach((location) => {
    if (location[2] == "A") {
        currentLocations.push(location);
    }
});

console.log(currentLocations, directions);

const minSteps: number[] = currentLocations.map((location) => {
    let currentLocation = location;
    let steps = 0;
    while (currentLocation[2] !== "Z") {
        for (let i = 0; i < directions.length; i++) {
            steps++;
            const direction = directions[i];
            currentLocation = map[currentLocation][direction];

            if (currentLocation[2] === "Z") break;
        }
    }

    return steps;
});

console.log(minSteps);
