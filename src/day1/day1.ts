/*
  Advent of Code 2024 - Jerren Trifan
  Day 1
  Link to problem and instructions: https://adventofcode.com/2024/day/1
*/

import { GetFileData } from '../util';

const inputData = await GetFileData();

const lines = inputData.split('\r\n');

console.log(lines);
const l1 = [];
const l2 = [];

let p1TotalDistance = 0;

for (let line of lines) {
	const num1 = parseInt(line.split('   ')[0]);
	const num2 = parseInt(line.split('   ')[1]);
	if (Number.isNaN(num1) || Number.isNaN(num2)) {
		continue;
	}
	l1.push(num1);
	l2.push(num2);
}

l1.sort((a, b) => a - b);
l2.sort((a, b) => a - b);

for (let i = 0; i < l1.length; i++) {
	p1TotalDistance += Math.abs(l1[i] - l2[i]);
}

console.log(`Part 1 - Total Distance: ${p1TotalDistance}`);

// part 2

const freqMap = new Map<number, number>();

for (let val of l2) {
	freqMap.set(val, (freqMap.get(val) ?? 0) + 1);
}

let p2SimilarityScore = 0;

for (let val of l1) {
	p2SimilarityScore += val * (freqMap.get(val) ?? 0);
}

console.log(`Part 2 - Similarity Score: ${p2SimilarityScore}`);
