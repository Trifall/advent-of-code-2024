import { GetFileData } from '../util';

const inputData = await GetFileData();
const lines = inputData.split('\n');

/*
  Notes after completion:
    - Thought this one was pretty easy compared to day 5.
    - Originally i looped through the bounds of time holding 1-time and calculated the distance for each time -
      but then I refactored it to find the first and last possible time and calculate the number of possible times
      based on that.
*/

console.time(`Process Time`);

const timeString = lines[0];
const distanceString = lines[1];

type Record = {
	time: number;
	distance: number;
};

// Part 1
const p1_times = timeString
	.split(': ')[1]
	.trim()
	.split(' ')
	.map((val) => parseInt(val))
	.filter(Boolean);

const p1_distances = distanceString
	.split(': ')[1]
	.trim()
	.split(' ')
	.map((val) => parseInt(val))
	.filter(Boolean);

// create records for each time/distance pair
let p1_records: Record[] = p1_times.map((time, index) => {
	return {
		time: time,
		distance: p1_distances[index],
	} as Record;
});

// calculate the distance for a given button held time
const calculateDistance = (buttonHeldTime: number, maxTime: number): number => {
	return (maxTime - buttonHeldTime) * buttonHeldTime;
};

// count the number of valid hold times for a given record
const countValidHoldTimes = (record: Record) => {
	// used two loops to find the bounds, then subtracted the two to get the number of possible times
	let lowestTimeHeld = 0;
	let highestTimeHeld = record.time;

	// find the lowest possible time
	while (calculateDistance(lowestTimeHeld, record.time) < record.distance + 1) {
		lowestTimeHeld++;
	}

	// find the highest possible time
	while (calculateDistance(highestTimeHeld, record.time) < record.distance + 1) {
		highestTimeHeld--;
	}

	// return the number of possible times
	return highestTimeHeld - lowestTimeHeld + 1;
};

// calculate the number of valid hold times for each record, then multiply them together
const p1_answer = p1_records
	.map((record) => {
		return countValidHoldTimes(record);
	})
	.reduce((acc, val) => acc * val, 1);

// Part 2
// The same as part 1, but with a single record
const p2_time = parseInt(timeString.split(': ')[1].trim().split(' ').filter(Boolean).join(''));
const p2_distance = parseInt(distanceString.split(': ')[1].trim().split(' ').filter(Boolean).join(''));

// calculate the number of valid hold times for the record
const p2_answer = countValidHoldTimes({
	time: p2_time,
	distance: p2_distance,
} as Record);

// Results
console.log(`Part 1: ${p1_answer}`);
console.log(`Part 2: ${p2_answer}`);

console.timeEnd(`Process Time`);
