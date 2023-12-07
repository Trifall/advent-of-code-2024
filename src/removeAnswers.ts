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

	// find the line that contains the answer
	const answerLine = instructionsFileSplit.find((val) => val.includes('Your puzzle answer was'));
	if (!answerLine) {
		console.error(`𐄂 Couldn't find answer line in instructions file from ${printableDayDirectory}`);
		continue;
	}

	// get the answer from the line
	const answer = answerLine.split('Your puzzle answer was ')[1].split('.')[0];
	if (!answer) {
		console.error(`𐄂 Couldn't find answer in answer line from ${printableDayDirectory}`);
		continue;
	} else if (answer === '___') {
		console.log(`✓ Answer in answer line from ${printableDayDirectory} is already removed`);
		continue;
	}

	// remove the answer line from the instructions file
	const instructionsFileWithoutAnswer = instructionsFile.replace(answerLine, 'Your puzzle answer was ___.');
	if (!instructionsFileWithoutAnswer) {
		console.error(
			`𐄂 Couldn't remove answer line from instructions file from ${printableDayDirectory}/instructions.txt`
		);
		continue;
	}

	// write the new instructions file
	await Bun.write(directoryFilePath, instructionsFileWithoutAnswer);
	console.log(`✓ Removed answer '${answer}' from ${printableDayDirectory}/instructions.txt`);
}
