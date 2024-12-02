import { GetFileData } from '../util';

const inputData = await GetFileData();

const lines = inputData.split('\r\n');

// valid report check function
function isValid(levels: string[]) {
	// scuffed list check
	if (!levels[1] || !levels[0]) return false;
	// calc descending or ascending
	let descending = parseInt(levels[0]) > parseInt(levels[1]);

	// loop through each level and compare it to the next
	for (let j = 0; j < levels.length - 1; j++) {
		const diff = parseInt(levels[j]) - parseInt(levels[j + 1]);
		const absDiff = Math.abs(diff);

		// diff out of range
		if (absDiff > 3 || absDiff < 1) {
			return false;
		}
		// wrong direction
		if ((descending && diff <= 0) || (!descending && diff >= 0)) {
			return false;
		}
	}

	// valid list if it hasn't returned yet
	return true;
}

// Part 1
let safeReports = 0;

for (let i = 0; i < lines.length; i++) {
	let levels = lines[i].split(' ');

	if (isValid(levels)) {
		safeReports++;
	}
}

console.log(`Part 1 - Safe Reports: ${safeReports}`);

// Part 2

let newSafeReports = 0;

for (let i = 0; i < lines.length; i++) {
	let levels = lines[i].split(' ');
	let foundSafe = false;

	// remove each level until a match or original line is exhausted
	for (let k = 0; k < levels.length; k++) {
		let tempArr = [...levels];
		tempArr.splice(k, 1); // remove kth element

		if (isValid(tempArr)) {
			foundSafe = true;
			break; // can skip rest of checks if valid list is found
		}
	}

	if (foundSafe) {
		newSafeReports++;
	}
}

console.log(`Part 2 - Safe Reports (Post-Dampener): ${newSafeReports}`);
