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
	const answerLines = instructionsFileSplit.filter((val) => val.includes('Your puzzle answer was'));
	if (!answerLines || !answerLines.length) {
		console.error(`𐄂 Couldn't find any answer line in instructions file from ${printableDayDirectory}`);
		continue;
	}

	let instructionsFileEdited = instructionsFile;

	for (const answerLine of answerLines) {
		instructionsFileEdited = instructionsFileEdited.replace(answerLine, 'Your puzzle answer was ___.');
		if (!instructionsFileEdited) {
			console.error(`𐄂 Couldn't remove answer line from instructions file from ${printableDayDirectory}`);
			continue;
		}
	}

	// write the new instructions file
	await Bun.write(directoryFilePath, instructionsFileEdited);
	console.log(`✓ Removed answer(s) from ${printableDayDirectory}`);
}
