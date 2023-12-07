import { GetFileData } from '../util';

const inputData = await GetFileData();

const splitData = inputData.split('\n');

let totalSum = 0;

const number_values = {
	zero: 0,
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
} as const;

// gets the first and last index of the value
function getAllIndexes(str: string, val: string) {
	const indexes: [number, number][] = [];
	indexes.push([str.indexOf(val), str.lastIndexOf(val)]);
	return indexes;
}

// loop over all rows
for (const item of splitData) {
	// if length is zero then skip
	if (item.length === 0) {
		continue;
	}

	// get the first and last index of each number possibility.
	// response looks like [[2,25], 5], where 2 is the first index, 25 is the last index, 5 is the value
	const indexes: [number[], number][] = (Object.keys(number_values) as (keyof typeof number_values)[]).map((val) => {
		return [getAllIndexes(item, val.toString())[0], number_values[val]];
	});

	// initialize loop trackers
	let firstValIndex = item.length + 1;
	let firstValue = 0;

	let lastValIndex = -1;
	let lastValue = 0;

	// loop over the indexes array
	for (let i = 0; i < indexes.length; i++) {
		// if the first index is found, and its less than the current largest, replace it
		if (indexes[i][0][0] >= 0 && firstValIndex > indexes[i][0][0]) {
			firstValIndex = indexes[i][0][0];
			firstValue = indexes[i][1];
		}
		// if the last index is found, and its greater than the current smallest, replace it
		if (indexes[i][0][1] >= 0 && lastValIndex < indexes[i][0][1]) {
			lastValIndex = indexes[i][0][1];
			lastValue = indexes[i][1];
		}
	}

	// if for some reason, there were no items found, throw an error
	if (firstValIndex === item.length + 1 || lastValIndex === -1) {
		throw Error('One of the indexes not found!');
	}

	// add the parsed combined value to the sum.
	try {
		totalSum += parseInt(firstValue.toString() + lastValue.toString());
	} catch {
		throw Error(`could not parse value '${firstValue.toString() + lastValue.toString()}'`);
	}
}

// console.log(`splitData[0] ${splitData[0]}`);

console.log(`totalSum: ${totalSum}`);
