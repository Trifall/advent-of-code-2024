import { GetFileData } from '../util';

const inputData = await GetFileData();

const splitData = inputData.split('\n');

/*
 Notes after completion:
  - I kinda liked this solution, using and object and mapping over keys felt really easy to implement.
  - Definitely was easier for me than Day 3. Pretty concise solution I think.
*/

type CardResult = {
	gainedPoints: number;
	matchCount: number;
	count: number;
};

// Create a results object
const CardResults = {} as any;

// determine all original card values
for (let card of splitData) {
	if (card.length === 0) continue;

	// Get the card number and number lists
	const cardNumber = parseInt(card.split(':')[0].split('Card ')[1]);
	const lists = card.split(':')[1].split(' | ');

	// Separate the lists into their own arrays
	const winningNumbers = lists[0]
		.split(' ')
		.map((val) => parseInt(val))
		.filter(Boolean);

	const chosenNumbers = lists[1]
		.split(' ')
		.map((val) => parseInt(val))
		.filter(Boolean);

	let matchCount = 0;
	let gainedPoints = 0;

	// find the matches between the chosen numbers and the winning numbers
	winningNumbers.some((val) => {
		if (chosenNumbers.includes(val)) {
			matchCount++;
			// The first match makes the card worth one point and each match after the first doubles the point value of that card.
			if (gainedPoints === 0) gainedPoints++;
			else gainedPoints *= 2;
		}
	});

	// create result object inside of CardResults
	CardResults[cardNumber] = {
		gainedPoints: gainedPoints,
		matchCount: matchCount,
		count: 1,
	} as CardResult;
}

console.log(
	`Part 1 - Point Total: ${Object.values(CardResults).reduce(
		(acc, currentValue) => (acc as number) + (currentValue as CardResult).gainedPoints,
		0
	)}`
);

/* Part 2
 - Now there's no such thing as "points". 
 - Instead, scratchcards only cause you to win more scratchcards equal to the number of winning numbers you have.
 - Copies of scratchcards are scored like normal scratchcards and have the same card number as the card they copied.
*/

// loop over the card results entries
for (const [cardNumber, data] of Object.entries(CardResults)) {
	const cardData = data as CardResult;
	if (cardData.matchCount === 0) {
		// if this card doesnt have any match count, skip it
		continue;
	} else {
		// card has matches
		for (let n = 0; n < cardData.matchCount; n++) {
			// sum the next nth cards' counts with the current cards total count
			(CardResults[parseInt(cardNumber) + n + 1] as CardResult).count += cardData.count;
		}
	}
}

// print the results !
console.log(
	`Part 2 - Total Cards: ${Object.values(CardResults).reduce(
		(acc, currentValue) => (acc as number) + (currentValue as CardResult).count,
		0
	)}`
);
