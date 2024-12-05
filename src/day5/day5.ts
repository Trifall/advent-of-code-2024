/*
  Advent of Code 2024 - Jerren Trifan
  Day 5
  Link to problem and instructions: https://adventofcode.com/2024/day/5
*/

import { GetFileData } from '../util';

const inputData = await GetFileData();

const lines = inputData.split('\r\n').map((val) => val.trim());

// filter out rules and updates
const rules = lines.filter((line) => line.length < 6 && line.length > 0);
const updates = lines.filter((line) => line.length > 6);

// create map of all rules
let rulesMap = new Map<string, string[]>();

// insert map values
for (let rule of rules) {
	let nodeVal = rule.split('|')[0];
	let beforePage = rule.split('|')[1];

	rulesMap.set(nodeVal, [beforePage].concat(rulesMap.get(nodeVal) ?? []));
}

// p1 lines
let validLines = [];
// p2 lines
let invalidLines = [];

for (let updateLine of updates) {
	const values = updateLine.split(',');
	let parsed = [];
	let valid = true;
	for (let i = 0; i < values.length; i++) {
		// if first item, just add it
		if (parsed.length < 1) parsed.push(values[i]);
		let preRules = rulesMap.get(values[i]);
		if (preRules && preRules.filter((value) => parsed.includes(value)).length > 0) {
			// incorrect order, break
			valid = false;
			break;
		}
		// add seen page
		parsed.push(values[i]);
	}

	if (!valid) {
		// track for p2
		invalidLines.push(updateLine);
		// go to next update line
		continue;
	}

	// add valid line
	validLines.push(updateLine);
}

let p1Result = 0;
validLines.forEach((val) => {
	const vals = val.split(',');
	const middleValue = vals.at(vals.length / 2);
	if (middleValue) p1Result += parseInt(middleValue);
});

console.log(`Part 1 - Result: ${p1Result}`);

/* Part 2 */

const insert = (arr: string[], index: number, newItem: string) => [
	...arr.slice(0, index),
	newItem,
	...arr.slice(index),
];

let fixedLines = [];

for (let line of invalidLines) {
	let values = line.split(',');

	// hybrid bubble / insertion sort
	for (let i = 0; i < values.length; i++) {
		for (let j = i + 1; j < values.length; j++) {
			// if value[j] page contains the value[i] page
			// in its predecessors, then move it to before value[i] page
			if (rulesMap.get(values[j])?.includes(values[i])) {
				// move j page to before the i page
				let removed = values.splice(j, 1)[0];
				values = insert(values, i, removed);
				j--;
			}
		}
	}
	fixedLines.push(values);
}

let p2Result = 0;

fixedLines.forEach((val) => {
	const middleValue = val.at(val.length / 2);
	if (middleValue) p2Result += parseInt(middleValue);
});

console.log(`Part 2 - Result: ${p2Result}`);
