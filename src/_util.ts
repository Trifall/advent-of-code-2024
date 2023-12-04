export const GetFileData = async (filePath: string) => {
	const inputFile = Bun.file(filePath);

	if (!(await inputFile.exists())) {
		console.error(`Couldn't retrieve file with path '${filePath}'`);
		process.exit(0);
	}

	const fileData = await inputFile.text();
	if (!fileData) throw Error(`Couldn't get text data from file.`);

	console.log(`Loaded Input File: ${filePath} `);
	return fileData;
};
