import { GetFileData } from '../util';

const inputData = await GetFileData();

const lines = inputData.split('\n');
console.time(`Process Time`);

const CardValues = {
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14,
};

enum HandStrength {
	FiveOfAKind,
	FourOfAKind,
	FullHouse,
	ThreeOfAKind,
	TwoPair,
	OnePair,
	High,
}

type Hand = {
	cards: string;
	bid: number;
	strength: HandStrength;
};

let hands: Hand[] = [];

// sort the hands by strength, then by card value
const sortHands = (a: Hand, b: Hand) => {
	if (a.strength === b.strength) {
		const handACards = a.cards.split('');
		const handBCards = b.cards.split('');

		for (let i = 0; i < handBCards.length; i++) {
			const diff =
				CardValues[handACards[i] as keyof typeof CardValues] - CardValues[handBCards[i] as keyof typeof CardValues];

			if (diff !== 0) {
				return diff;
			}
		}
	}
	return b.strength - a.strength;
};

// calculate the strength of a hand based on the number of each card
const calculateStrength = (cardCounts: Record<string, number>): HandStrength => {
	const uniqueCardsLength = Object.keys(cardCounts).length;
	const counts = Object.values(cardCounts);

	let strength = HandStrength.High;
	if (uniqueCardsLength === 4 && counts.includes(2)) {
		strength = HandStrength.OnePair;
	} else if (uniqueCardsLength === 3 && counts.includes(2)) {
		strength = HandStrength.TwoPair;
	} else if (uniqueCardsLength === 3 && counts.includes(3)) {
		strength = HandStrength.ThreeOfAKind;
	} else if (uniqueCardsLength === 2 && counts.includes(3)) {
		strength = HandStrength.FullHouse;
	} else if (uniqueCardsLength === 2 && counts.includes(4)) {
		strength = HandStrength.FourOfAKind;
	} else if (uniqueCardsLength === 1) {
		strength = HandStrength.FiveOfAKind;
	}

	return strength;
};

const part1 = () => {
	CardValues.J = 11;
	hands = [];
	lines.forEach((line) => {
		const [cards, bid] = line.split(' ');

		// calculate the number of each card
		const cardCounts = cards.split('').reduce<Record<string, number>>((acc, card) => {
			acc[card] = acc[card] ? acc[card] + 1 : 1;
			return acc;
		}, {});

		hands.push({
			cards: cards,
			bid: Number(bid),
			strength: calculateStrength(cardCounts),
		});
	});

	// sort the hands
	hands.sort((a, b) => sortHands(a, b));

	return hands.reduce((acc, game, rank) => {
		return game.bid * (rank + 1) + acc;
	}, 0);
};

const part2 = () => {
	// Part 2
	CardValues.J = 0;
	hands = [];
	lines.forEach((line) => {
		const [cards, bid] = line.split(' ');

		// calculate the number of each card
		const cardCounts = cards.split('').reduce<Record<string, number>>((acc, card) => {
			acc[card] = acc[card] ? acc[card] + 1 : 1;
			return acc;
		}, {});

		if ('J' in cardCounts) {
			// get the amount of jokers
			const jokerCount = cardCounts['J'];
			delete cardCounts['J'];
			// sort the cards by count, then value
			const leftOverCards = Object.entries(cardCounts)
				.filter(([, count]) => count > 0)
				.sort((a, b) => {
					const diff = b[1] - a[1];
					if (diff !== 0) return diff;

					return CardValues[b[0] as keyof typeof CardValues] - CardValues[a[0] as keyof typeof CardValues];
				});

			if (leftOverCards.length > 0) {
				// add the amount of jokers to the card with the highest count
				cardCounts[leftOverCards[0][0]] += jokerCount;
			} else if (jokerCount === 5) {
				// all wildcard - make the highest possible hand
				cardCounts['A'] = 5;
			}
		}

		hands.push({
			cards: cards,
			bid: Number(bid),
			strength: calculateStrength(cardCounts),
		});
	});

	hands = hands.sort((a, b) => sortHands(a, b));

	return hands.reduce((acc, game, rank) => {
		return acc + (rank + 1) * game.bid;
	}, 0);
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);

console.timeEnd(`Process Time`);
