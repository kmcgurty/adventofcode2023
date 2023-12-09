import fs from "fs";

interface IMap {
    sourceName: string;
    destinationName: string;
    mappers: {
        source: number;
        destination: number;
        range: number;
    }[];
}

interface ISeed {
    start: number;
    end: number;
}

const fileData = fs.readFileSync("./input.txt").toString();
const { seeds, maps } = parseInput(fileData);
console.log("lowest location:", getLowestLocation());

function getLowestLocation(): number {
    let lowestLocation: number = -1;
    let loopCount = 0;
    let totalSeeds = 0;
    const UpdateInterval = 10000;
    let timeSinceLastUpdate = Date.now();

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const end = seed.start + seed.end;

        totalSeeds += end - seed.start;
    }

    console.log("total seeds:", totalSeeds);

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        for (let j = seed.start; j < seed.start + seed.end; j++) {
            const location = getLocationForSeed(j);
            if (lowestLocation == -1 || location < lowestLocation) {
                lowestLocation = location;
            }

            if (loopCount % 1000) {
                if (Date.now() - timeSinceLastUpdate > UpdateInterval) {
                    const percentDone = (loopCount / totalSeeds) * 100;
                    timeSinceLastUpdate = Date.now();
                    console.log(`${percentDone.toFixed(1)}% finished`);
                }
            }

            loopCount++;
        }
    }

    return lowestLocation;
}

function getLocationForSeed(seed: number) {
    let lastDestinationValue = seed;
    for (let i = 0; i < maps.length; i++) {
        const { sourceName, destinationName } = maps[i];

        lastDestinationValue = getDestination(
            sourceName,
            destinationName,
            lastDestinationValue
        );
    }

    return lastDestinationValue;
}

function getDestination(source: string, destination: string, input: number) {
    //console.log(`source: "${source}", destination: "${destination}", ${input}`);
    const index = maps.findIndex((map) => {
        return map.destinationName == destination;
    });

    const map = maps[index];
    if (map == undefined || map.sourceName !== source)
        throw Error("Unable to find corresponding map");

    const mapperIndex = map.mappers.findIndex((mapper) => {
        const range = mapper.range - 1;
        const insideRange =
            input >= mapper.source && input <= mapper.source + range;
        return insideRange;
    });

    // if the input is not in the range of any of the sources, return the input
    if (mapperIndex == -1) return input;

    const mapper = map.mappers[mapperIndex];
    const offset = input - mapper.source;
    const mapped = offset + mapper.destination;
    return mapped;
}

////////////////////////////////////////////////////

function parseInput(rawInput: string): {
    seeds: ISeed[];
    maps: IMap[];
} {
    const seedsexpr = new RegExp(/seeds: ((?:\d* )+\d+)/);
    const rawSeeds = rawInput.match(seedsexpr);
    if (rawSeeds == null) throw Error("bad input");
    const stringSeeds = rawSeeds[1].split(" ");
    const separateSeeds = stringSeeds.map((stringSeed) => parseInt(stringSeed));
    const seeds: ISeed[] = [];
    for (let i = 0; i < separateSeeds.length; i += 2) {
        const start = separateSeeds[i];
        const end = separateSeeds[i + 1];

        seeds.push({
            start,
            end,
        });
    }

    //console.log(seeds);

    const mapsexpr = new RegExp(/(\w+)-to-(\w+) map:\n((?:(?:.+)\n?)+)/, "gm");
    const rawMaps = rawInput.matchAll(mapsexpr);

    const maps: IMap[] = [];
    for (const match of rawMaps) {
        const [_, sourceName, destinationName, rawNumbers] = match;
        const ranges = parseNumbers(rawNumbers);

        //console.log(sourceName, "to", destinationName);
        const mappers: IMap["mappers"] = ranges.map((range) => {
            const mapper = {
                source: range[1],
                destination: range[0],
                range: range[2],
            };
            //console.log(mapper);
            return mapper;
        });

        maps.push({
            sourceName,
            destinationName,
            mappers,
        });
    }

    //console.log("------");

    return {
        seeds,
        maps,
    };
}

function parseNumbers(rawNumbers: string) {
    const lines = rawNumbers.split(/\n/);
    const parsed = lines.reduce<number[][]>((results, line) => {
        if (line == "") return results;
        const [destination, source, range] = line.split(" ");
        //console.log(line);
        results.push([
            parseInt(destination),
            parseInt(source),
            parseInt(range),
        ]);
        return results;
    }, []);
    return parsed;
}
