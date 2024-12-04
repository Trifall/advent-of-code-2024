import { readdir } from 'fs/promises';
import { AOC_URL, AOC_YEAR } from 'src/constants';

const currentDirectory = import.meta.dir;

const directoryData = await readdir(currentDirectory);

if (!directoryData) throw Error(`Couldn't read directory data from ${currentDirectory}`);

let dayDirectories = directoryData.filter((val) => val.includes('day')).sort();

// loop over each day directory
for (const dayDirectory of dayDirectories) {
	const dayNumber = dayDirectory[dayDirectory.length - 1];
	const directoryFilePath = `${currentDirectory}/${dayDirectory}/day${dayNumber}.ts`;
	const printableDayDirectory = `${dayDirectory}/day${dayNumber}.ts`;

	const scriptFile = await Bun.file(directoryFilePath).text();
	if (!scriptFile) {
		console.error(`✗ Couldn't read script file from ${printableDayDirectory}`);
		continue;
	}

	const scriptFileSplit = scriptFile.split('\n');
	if (!scriptFileSplit) {
		console.error(`Couldn't split script file from ${printableDayDirectory}`);
		continue;
	}

	/*
    Advent of Code - Jerren Trifan - 2024
    Day <number>
    Link to instructions: <link>
  */

	// Check if the comment already exists
	if (scriptFileSplit[1]?.includes('Advent of Code')) {
		console.log(`✓ Header comment already added to ${printableDayDirectory}`);
		continue;
	}

	// Construct the header comment
	const headerComment = [
		'/*',
		`  Advent of Code ${AOC_YEAR} - Jerren Trifan`,
		`  Day ${dayNumber}`,
		`  Link to problem and instructions: ${AOC_URL}/${AOC_YEAR}/day/${dayNumber}`,
		'*/',
		'', // Add an empty line between the comment and the existing code
	];

	// Prepend the header comment to the script content
	const updatedScriptContent = [...headerComment, ...scriptFileSplit].join('\n');

	// Write the updated content back to the file
	await Bun.write(directoryFilePath, updatedScriptContent);
	console.log(`✓ Added header comment to ${printableDayDirectory}`);
}
