import { GetFileData } from './_util';

const inputFile = await GetFileData('./day2_data.txt');

const splitData = inputFile.split('\n');

// part 1: Determine which games would have been possible with <given> max values. What is the sum of the IDs of those games?
let gameIdTotal = 0;
// part 2: For each game, find the minimum set of cubes that must have been present. What is the sum of the power of these sets?
let sumPowerSets = 0;

// maximum allowed number of each color
const MAX_VALUES = {
	red: 12,
	green: 13,
	blue: 14,
} as const;

// type for maximum found number in each game by color
type HighestValues = {
	red: number;
	green: number;
	blue: number;
};

type Color = keyof HighestValues;

// The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together.
const AddHighestValues = (valuesObj: HighestValues) => {
	sumPowerSets += valuesObj.blue * valuesObj.green * valuesObj.red;
};

// loop over each game
for (const row of splitData) {
	const gameID = parseInt(row.slice(row.indexOf(' '), row.indexOf(':')).trim());

	// spit the showings into an array
	const sets = row
		.slice(row.indexOf(':') + 1)
		.trim()
		.split(';');

	let isGameValid = true;

	// create temp object for storing the max values for sum of the power of the set
	let highest_values = {
		red: 0,
		green: 0,
		blue: 0,
	} as HighestValues;

	// loop over each showing
	for (const showing of sets) {
		const combo = showing.split(',');

		// map over each individual roll
		combo.map((val) => {
			// get color and number
			const count = parseInt(val.trim().split(' ')[0]);
			const color = val.trim().split(' ')[1] as Color;

			// check if count shown is greater than allowed max
			if (count > MAX_VALUES[color]) {
				isGameValid = false;
			}

			// check if count shown is greater than currently tracked highest
			if (highest_values[color] < count) {
				highest_values[color] = count;
			}
		});
	}

	if (isGameValid) {
		// if game is valid, add the ID to the total
		gameIdTotal += gameID;
	}

	// sum of power function call
	AddHighestValues(highest_values);
}

// part 1 result
console.log(`Valid Game ID Total: ${gameIdTotal}`);
// part 2 result
console.log(`Sum Power of Sets: ${sumPowerSets}`);
