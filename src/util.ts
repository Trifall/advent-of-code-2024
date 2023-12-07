export const GetFileData = async (IS_EXAMPLE_OVERRIDE?: boolean) => {
	// get the file path up to the last folder
	const IS_EXAMPLE = Bun.argv.includes('--example') || Bun.argv.includes('-e') || IS_EXAMPLE_OVERRIDE;
	const callingPath = Bun.main.split('/').slice(0, -1).join('/');
	console.log(`===${IS_EXAMPLE ? 'EXAMPLE MODE' : 'INPUT MODE'}===`);
	const inputFilePath = IS_EXAMPLE ? `${callingPath}/example.txt` : `${callingPath}/input.txt`;
	const inputFile = Bun.file(`${inputFilePath}`);

	// const inputFilePath = `./${currentFile}_data.txt`;
	// const exampleFilePath = `./${currentFile}_example.txt`;

	if (!(await inputFile.exists())) {
		console.error(`Couldn't retrieve file with path '${inputFilePath}'`);
		process.exit(0);
	}

	const fileData = await inputFile.text();
	if (!fileData) throw Error(`Couldn't get text data from file '${inputFilePath}'`);

	console.log(`Loaded Input File: ${inputFilePath.split('/').pop()}`);
	return fileData;
};
