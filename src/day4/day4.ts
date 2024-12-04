import { GetFileData } from '../util';

const inputData = await GetFileData();

const lines = inputData
	.split('\r\n')
	.map((val) => val.trim())
	.filter((n) => n);

const checkLetter = (row: number, col: number, letter: string) => {
	return lines[row]?.[col] === letter;
};

const directions = [
	[1, 0], // down
	[-1, 0], // up
	[0, -1], // left
	[0, 1], // right
	[-1, -1], // up-left
	[-1, 1], // up-right
	[1, -1], // down-left
	[1, 1], // down-right
];

// search for 'X' characters, then search relative directions for matching 'XMAS'
const p1FindMatches = (row: number, col: number): number => {
	if (lines[row]?.[col] !== 'X') return 0;

	let matches = 0;

	for (const [dr, dc] of directions) {
		if (
			checkLetter(row + dr, col + dc, 'M') &&
			checkLetter(row + 2 * dr, col + 2 * dc, 'A') &&
			checkLetter(row + 3 * dr, col + 3 * dc, 'S')
		) {
			matches++;
		}
	}

	return matches;
};

// search for 'A' characters, then search relative diagonals
const p2FindMatches = (row: number, col: number) => {
	// check if valid 'A' char && at least 1 dist from boundaries
	if (lines[row]?.[col] !== 'A' || row < 1 || row >= lines.length - 1 || col < 1 || col >= lines[row].length - 1)
		return 0;

	/*
	Check diag 1
		X - -
			A
		-	- X
	*/

	const upLeftChar = lines[row - 1][col - 1];
	const bottomRightChar = lines[row + 1][col + 1];

	const diag1Valid = (upLeftChar === 'M' && bottomRightChar === 'S') || (upLeftChar === 'S' && bottomRightChar === 'M');

	if (!diag1Valid) return 0;

	/*
	If diag 1 is valid, check diag 2
		- - X
			A
		X	- -
	*/

	const upRightChar = lines[row - 1][col + 1];
	const bottomLeftChar = lines[row + 1][col - 1];

	const diag2Valid = (upRightChar === 'M' && bottomLeftChar === 'S') || (upRightChar === 'S' && bottomLeftChar === 'M');

	if (!diag2Valid) return 0;

	// both diags are valid
	return 1;
};

let p1Result = 0;
let p2Result = 0;

for (let i = 0; i < lines.length; i++) {
	for (let j = 0; j < lines[i].length; j++) {
		p1Result += p1FindMatches(i, j);
		p2Result += p2FindMatches(i, j);
	}
}

console.log(`Part 1 - Result: ${p1Result}`);
console.log(`Part 2 - Result: ${p2Result}`);
