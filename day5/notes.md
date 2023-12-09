seeds: 79 14 55 13

```ts
interface IMap {
    sourceName: string;
    destinationName: string;
    numbers: {
        source: number;
        destination: number;
        range: number;
    }[];
}

// seed-to-soil map:
// 50 98 2
// 52 50 48

// seed == source
// soil == destination

const maps: IMap[] = [
    {
        sourceName: "seed",
        destinationName: "soil",
        mappers: [
            {
                source: 98,
                destination: 52,
                range: 48,
            },
        ],
    },
];

function getDestination(source: string, destination: string, input: number) {
    const index = maps.findIndex((map) => {
        return map.destinationName == destination;
    });

    const map = maps[index];
    if (map.sourceName !== source) return;

    const mapperIndex = map.mappers.findIndex((mapper) => {
        const range = mapper.range - 1;
        return input <= mapper.source || input > mapper.source + range;
    });

    // if the input is not in the range of any of the sources, return the input
    if (mapperIndex == -1) return input;

    const mapper = map.mappers[mapperIndex];
    const offset = input - mapper.source;
    const mapped = offset + mapper.destination;
    return mapped;
}

// and it would look like something like:
const seed79 = getDestination("seed-to-soil", 79);
// seed 99 == soil 51
// seed 79 == soil 81
// seed 14 == soil 14
// seed 55 == soil 57
// seed 13 == soil 13
```

I think the steps would look something like this:
input - source
that number + destination

    map: { source: 98, destination: 50, range: 2 }
    in need to turn 99 (the input) into 51 with MATH

    the same formula needs to work for
    { source: 50, destination: 52, range: 48 }
    79 seed into 81

destination start | source start | range length
the first line means:
source range starts at 98, and contains two values (+2-1) 98, 99
destination range starts at 50, and contains (+2-1) 50, 51

the second line means:
source range starts at 50, and contains 50, ..., 97
destination range starts at 52, and contains 52, ..., 99

if a seed number isn't mapped, that soil number == that number
eg, seed # 10, == soil # 10

---
