// recursively remove answers from a given directory
// the answers are in the files instructions.txt on a line that contains the string "Your puzzle answer was <ANSWER>."
// folder structure is: day<number>/instructions.txt
import { readdir } from 'fs/promises';

const currentDirectory = import.meta.dir;

const directoryData = await readdir(currentDirectory);

if (!directoryData) throw Error(`Couldn't read directory data from ${currentDirectory}`);

let dayDirectories = directoryData.filter((val) => val.includes('day')).sort();

// loop over each day directory
for (const dayDirectory of dayDirectories) {
	const directoryFilePath = `${currentDirectory}/${dayDirectory}/instructions.txt`;
	const printableDayDirectory = `${dayDirectory}/instructions.txt`;
	// get the instructions file
	const instructionsFile = await Bun.file(directoryFilePath).text();
	if (!instructionsFile) {
		console.error(`✗ Couldn't read instructions file from ${printableDayDirectory}`);
		continue;
	}

	// split the instructions file by new line
	const instructionsFileSplit = instructionsFile.split('\n');
	if (!instructionsFileSplit) {
		console.error(`Couldn't split instructions file from ${printableDayDirectory}`);
		continue;
	}

	const startingText = 'Link to instructions for Day';

	// find the line that contains the answer
	const answerLines = instructionsFileSplit.filter((val) => val.includes('--- Day '))?.[0];
	if (!answerLines || !answerLines.length) {
		if (instructionsFileSplit.filter((val) => val.includes(startingText))?.[0]) {
			console.log(`✓ File is in correct format: ${printableDayDirectory}`);
			continue;
		}
		console.error(`𐄂 Couldn't find any answer line in instructions file from ${printableDayDirectory}`);
		continue;
	}

	const dayNumber = answerLines.split('--- Day ')[1][0];
	const problemName = answerLines.split('--- Day ')[1].split(' ---')[0].substring(3);

	let newFileContent = `${startingText} ${dayNumber} '${problemName}': https://adventofcode.com/${new Date().getFullYear()}/day/${dayNumber}`;

	// write the new instructions file
	await Bun.write(directoryFilePath, newFileContent);
	console.log(`✓ Removed answer(s) from ${printableDayDirectory}`);
}
