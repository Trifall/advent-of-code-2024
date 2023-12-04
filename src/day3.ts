import { GetFileData } from './_util';

const inputFile = await GetFileData('./day3_data.txt');

const splitData = inputFile.split('\n');

// For row and column reference: Row = y, Column = x

/*
	Notes after completion:
		- Could probably use a map or something to better manage coordinates, faster.
		- Figuring out one loop might be more ideal, but I'm not sure about that.
*/

type Coordinate = {
	x: number;
	y: number;
};

type Part = {
	value: number;
	coordinates: Coordinate[];
};

type ScanResult = {
	adjacentParts: Part[];
	gearRatio: number;
};

const PotentialPartList: Part[] = [];
const PartList: Part[] = [];
const GearsList: ScanResult[] = [];

const SYMBOLS = [
	'*',
	'/',
	'%',
	'&',
	'^',
	'#',
	'@',
	'!',
	'+',
	'-',
	'$',
	'=',
	'(',
	')',
	'_',
	'|',
	'\\',
	'{',
	'}',
	'[',
	']',
	':',
	';',
	'?',
	"'",
	'<',
	'>',
	',',
	'`',
];

const data: string[][] = [];
// split the rows into characters
for (let row of splitData) {
	data.push(row.split(''));
}

// array filling function for coordinates mapping
function fillArray(start: number, end: number): number[] {
	return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const findPartFromCoordinate = (coordinate: Coordinate) => {
	const matchingParts = PotentialPartList.map((part) => {
		if (
			part.coordinates.some((_coordinate) => {
				return _coordinate.x === coordinate.x && _coordinate.y === coordinate.y;
			})
		) {
			return part;
		}
	});

	const parts = matchingParts.filter(Boolean);

	return parts[0];
};

const scanAdjacentNodes = (coordinate: Coordinate, isGearSymbol: boolean) => {
	const ResultingAdjacentParts: Part[] = [];

	// loop over the 3x3 area
	for (let y = coordinate.y - 1; y <= coordinate.y + 1; y++) {
		for (let x = coordinate.x - 1; x <= coordinate.x + 1; x++) {
			// check if center point, if so, skip
			if (coordinate.y === y && coordinate.x === x) continue;
			try {
				// check if the coordinate has a number on it, if it does, find the corresponding part from the parts list
				if (!isNaN(parseInt(data[y][x]))) {
					const part = findPartFromCoordinate({ x: x, y: y });
					if (part) {
						// Check if the part is already in the global array
						const isPartInGlobalArray = PartList.some(
							(_part) =>
								_part.coordinates[0].x === part.coordinates[0].x && part.coordinates[0].y === _part.coordinates[0].y
						);

						// Check if the part is already in the local array
						const isPartInLocalArray = ResultingAdjacentParts.some(
							(_part) =>
								_part.coordinates[0].x === part.coordinates[0].x && part.coordinates[0].y === _part.coordinates[0].y
						);

						// Check if the part is not in either array
						const isNewPart = !isPartInGlobalArray && !isPartInLocalArray;

						if (isNewPart) {
							// If the part is not in either array, add it to the local array
							ResultingAdjacentParts.push(part);
						}
					}
				}
			} catch {
				// if there is an error parsing the number, just go to the next character
				continue;
			}
		}
	}

	// Gear definition: A gear is any * symbol that is adjacent to exactly two part numbers.
	// - Its gear ratio is the result of multiplying those two numbers together.
	if (isGearSymbol && ResultingAdjacentParts.length === 2) {
		return {
			adjacentParts: ResultingAdjacentParts,
			gearRatio: ResultingAdjacentParts.reduce((partialRatio, a) => partialRatio * a.value, 1),
		} as ScanResult;
	}

	// not a gear, so set the gear ratio to 0
	return {
		adjacentParts: ResultingAdjacentParts,
		gearRatio: 0,
	} as ScanResult;
};

// Gear definition: A gear is any * symbol that is adjacent to exactly two part numbers.
const checkIsGearSymbol = (str: string) => {
	return str.trim() === '*';
};

// Find all potential part numbers
for (let y = 0; y < data.length; y++) {
	let num = '';
	let isNumberMatching = false;
	let startIndex = -1;
	for (let x = 0; x < data[y].length + 1; x++) {
		try {
			// is a number
			if (!isNaN(parseInt(data[y][x])) && data[y][x] !== '.') {
				if (!isNumberMatching) {
					// new number match sequence starting
					startIndex = x;
					isNumberMatching = true;
				}
				// concatenate current cell to number sequence
				num += data[y][x];
			} else {
				// not a number

				// number matching has finished a sequence
				if (isNumberMatching) {
					// fill coordinate array
					const numXList = fillArray(startIndex, x - 1);

					let coordinatesList: Coordinate[] = [];
					// fill the coordinate list on the object
					numXList.map((val) => {
						coordinatesList.push({
							x: val,
							y: y,
						});
					});

					// add object to potential part list
					PotentialPartList.push({
						value: parseInt(num),
						coordinates: coordinatesList,
					});

					// reset loop values;
					num = '';
					startIndex = -1;
					isNumberMatching = false;
				}
			}
		} catch {
			console.log(`Error: Couldn't convert value `);
		}
	}
}

// Start matching for valid parts and gears
for (let y = 0; y < data.length; y++) {
	for (let x = 0; x < data[y].length; x++) {
		// if the current character matches one of the schematic symbols
		if (SYMBOLS.includes(data[y][x])) {
			// check if this is a gear
			const isGearSymbol = checkIsGearSymbol(data[y][x]);
			// check all adjacent coordinates for parts
			const ScanResult = scanAdjacentNodes({ y: y, x: x }, isGearSymbol);

			// if the gear ratio is greater than 0, it means it was a valid gear, sum the value to the running gear ratio total
			if (ScanResult.gearRatio > 0) {
				GearsList.push(ScanResult);
			}
			// add all of the adjacent parts found in the ScanResult to the global array
			PartList.push(...ScanResult.adjacentParts);
		}
	}
}

// Print out the data
console.log(`Potential Part Numbers Found: ${PotentialPartList.length}`);
console.log(`Actual Part Numbers Found: ${PartList.length}`);
console.log(`Part Numbers Sum: ${PartList.reduce((partialSum, a) => partialSum + a.value, 0)}`);
console.log(`Gear Ratio Sum: ${GearsList.reduce((partialSum, a) => partialSum + a.gearRatio, 0)}`);
