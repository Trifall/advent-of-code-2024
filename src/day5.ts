import { GetFileData } from './_util';

const filePath = './day5_data.txt';
const fileData = await GetFileData(filePath);
console.log(`Using file: ${filePath}`);

type SeedCollection = Set<number>;
type MapFormat = [destination: number, source: number, length: number];

const Seeds: SeedCollection = new Set<number>();
const P2_Seeds: number[] = [];
const SeedRanges: MapFormat[] = [];
const SeedToSoilMap: MapFormat[] = [];
const SoilToFertilizerMap: MapFormat[] = [];
const FertilizerToWaterMap: MapFormat[] = [];
const WaterToLightMap: MapFormat[] = [];
const LightToTemperatureMap: MapFormat[] = [];
const TemperatureToHumidityMap: MapFormat[] = [];
const HumidityToLocationMap: MapFormat[] = [];

const MapsList = [
	SeedToSoilMap,
	SoilToFertilizerMap,
	FertilizerToWaterMap,
	WaterToLightMap,
	LightToTemperatureMap,
	TemperatureToHumidityMap,
	HumidityToLocationMap,
];

const addToMapping = (map: MapFormat[], destination: number, source: number, length: number): void => {
	// add the new map range to the map
	map.push([destination, source, length]);
};

const applyConversion = (conversionMap: MapFormat[], value: number): number => {
	// find the first map range that overlaps with the input range
	const entry = conversionMap.find(([, source, length]) => value >= source && value < source + length);
	// if no map range found, return the value
	return entry ? entry[0] + (value - entry[1]) : value;
};

const convertSeedToLocation = (seed: number): number => {
	return MapsList.reduce((value, map) => applyConversion(map, value), seed);
};

const parseInput = (input: string): void => {
	const [
		seedsUnconverted,
		seedToSoilUnconverted,
		soilToFertilizerUnconverted,
		fertilizerToWaterUnconverted,
		waterToLightUnconverted,
		lightToTemperatureUnconverted,
		temperatureToHumidityUnconverted,
		humidityToLocationUnconverted,
	] = input.split('\n\n');

	const unconvertedMaps = [
		seedToSoilUnconverted,
		soilToFertilizerUnconverted,
		fertilizerToWaterUnconverted,
		waterToLightUnconverted,
		lightToTemperatureUnconverted,
		temperatureToHumidityUnconverted,
		humidityToLocationUnconverted,
	];

	seedsUnconverted
		.split(': ')[1]
		.split(' ')
		.map(Number)
		.forEach((seed) => Seeds.add(seed));

	P2_Seeds.push(...seedsUnconverted.split(': ')[1].split(' ').map(Number));
	for (let i = 0; i < P2_Seeds.length; i = i + 2) {
		const start = P2_Seeds[i];
		const length = P2_Seeds[i + 1];
		SeedRanges.push([start, start, length]);
	}

	unconvertedMaps.forEach((rawMap, index) => {
		const entries = rawMap.split('\n');
		entries.shift();
		entries.forEach((entry) => {
			const [destination, source, length] = entry.split(' ').map(Number);
			addToMapping(MapsList[index], destination, source, length);
		});
	});
};

// Part 1
console.time('Time');
parseInput(fileData);

// find the lowest location
let lowestLocation = Number.MAX_SAFE_INTEGER;
for (const seed of Seeds) {
	const location = convertSeedToLocation(seed);
	if (location < lowestLocation) {
		lowestLocation = location;
	}
}

console.log(`Part 1: ${lowestLocation}`);

// Part 2

const offsetWithinRange = (value: number, [, source, length]: MapFormat): number => {
	// check difference, return value-source if true because that's the offset
	return value >= source && value < source + length ? value - source : -1;
};

const changeRange = (inputMappings: MapFormat[], mapMappings: MapFormat[]): MapFormat[] => {
	const outputMappings: MapFormat[] = [];
	for (const [inputDest, inputSource, inputLength] of inputMappings) {
		let offset = 0;
		// while the offset is less than the input length
		while (offset < inputLength) {
			// find the first map range that overlaps with the input range
			const mapMapping = mapMappings.find((mapMapping) => offsetWithinRange(inputDest + offset, mapMapping) !== -1);
			if (mapMapping) {
				// map range found
				const rangeOffset = offsetWithinRange(inputDest + offset, mapMapping);
				const offsetDelta = Math.min(mapMapping[2] - rangeOffset, inputLength - offset);
				outputMappings.push([mapMapping[0] + rangeOffset, inputSource + offset, offsetDelta]);
				offset += offsetDelta;
			} else {
				// no map range found, calculate the start of the next map range
				// or the end of the input range, whichever is smaller
				const nextRangeStart = Math.min(
					...mapMappings.map(([, start]) => start).filter((start) => start > inputDest + offset),
					inputDest + inputLength
				);
				// calculate the difference between the next range start and the current input destination and offset
				const diff = nextRangeStart - inputDest - offset;
				// add new output mapping with the adjusted destination, source, and length
				outputMappings.push([inputDest + offset, inputSource + offset, diff]);
				offset += diff;
			}
		}
	}
	return outputMappings;
};

let currentMapping = SeedRanges;

// change the range for each map
for (const map of MapsList) {
	currentMapping = changeRange(currentMapping, map);
}

// find the lowest location again
let lowestRangeLocation = Number.MAX_SAFE_INTEGER;
for (const mapping of currentMapping) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [dest, _source] = mapping;
	if (dest < lowestRangeLocation) {
		lowestRangeLocation = dest;
	}
}

console.log(`Part 2: ${lowestRangeLocation}`);

console.timeEnd('Time');
