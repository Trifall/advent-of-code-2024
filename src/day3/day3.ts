import { GetFileData } from '../util';

const inputData = await GetFileData(false);

const lines = inputData
	.split('\r\n')
	.map((val) => val.trim())
	.filter((n) => n);

let line = lines.join();
// prepend enable tag to the line for starting state
line = 'do()' + line;

function reverse(s: string) {
	return s.split('').reverse().join('');
}

// flippedInput for reverse searching
const flippedLine = reverse(line);

// search strings
const searchString = 'mul(';
const rEnableString = reverse('do()');
const rDisableString = reverse("don't()");

function solve(isPart1: boolean = true) {
	let result = 0;
	let latestIndex = 0;

	// while there is a valid searchString, and the latestIdx is in the bounds
	while (line.indexOf('mul(', latestIndex) !== -1 && latestIndex < line.length) {
		let idx = line.indexOf('mul(', latestIndex);
		// skip forward the idx to be the index of the '('
		idx += searchString.length - 1;

		if (!isPart1) {
			// calculate the correct reverse index
			const invertedIdx = flippedLine.length - idx - 1;
			// find the closest of each enable/disable
			let closestDisableIdx = flippedLine.indexOf(rDisableString, invertedIdx);
			let closestEnableIdx = flippedLine.indexOf(rEnableString, invertedIdx);

			// if disable is closer (and it has a value; default state is enabled), then skip
			if (closestDisableIdx < closestEnableIdx && closestDisableIdx !== -1) {
				// should be disabled
				latestIndex = idx + 1;
				continue;
			}
		}

		// find next comma, if not 2-4 characters away, then cancel
		let commaIdx = line.indexOf(',', idx + 1);

		// no more commas, can end loop
		if (commaIdx === -1) {
			break;
		}

		// if a comma is in valid range (2-4 char)
		if (commaIdx - idx <= 4 && commaIdx - idx >= 1) {
			// if a closing parenthesis is in valid range (2-4 char) from commaIdx
			let closingIdx = line.indexOf(')', commaIdx + 1);

			// no more closing parentheses, can end loop
			if (closingIdx === -1) {
				break;
			}

			if (closingIdx - commaIdx <= 4 && closingIdx - commaIdx >= 1) {
				const num1 = line.substring(idx + 1, commaIdx);
				const num2 = line.substring(commaIdx + 1, closingIdx);
				try {
					// parse the two number groups to ints
					const pNum1 = parseInt(num1);
					const pNum2 = parseInt(num2);

					const mult = pNum1 * pNum2;
					// add multiplication to result total
					result += mult;
					// set index to after latest closing parenthesis
					latestIndex = closingIdx + 1;
					continue;
				} catch (error) {
					// if either number cant be parsed, then restart the loop with next index
					latestIndex = idx + 1;
					continue;
				}
			}
		}

		// if any of the checks fail, or reach the end, the go to the next index
		latestIndex = idx + 1;
	}

	return result;
}

console.log(`Part 1 - Result: ${solve(true)}`);
console.log(`Part 2 - Result: ${solve(false)}`);
