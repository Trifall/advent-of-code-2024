import os from 'os';

export const GetFileData = async (IS_EXAMPLE_OVERRIDE?: boolean) => {
	// get the file path up to the last folder
	const IS_EXAMPLE = Bun.argv.includes('--example') || Bun.argv.includes('-e') || IS_EXAMPLE_OVERRIDE;
	const adjustedSlash = os.platform() === 'win32' ? `\\` : '/';

	const callingPath = Bun.main.split(adjustedSlash).slice(0, -1).join(adjustedSlash);
	console.log(`===${IS_EXAMPLE ? 'EXAMPLE MODE' : 'INPUT MODE'}===`);
	console.log(`Calling Path: ${callingPath.length > 0 ? callingPath : '.' + adjustedSlash}`);
	const inputFilePath = IS_EXAMPLE
		? `${callingPath.length > 0 ? callingPath + adjustedSlash : '.' + adjustedSlash}example.txt`
		: `${callingPath.length > 0 ? callingPath + adjustedSlash : '.' + adjustedSlash}input.txt`;
	const inputFile = Bun.file(`${inputFilePath}`);

	if (!(await inputFile.exists())) {
		console.error(`Couldn't retrieve file with path '${inputFilePath}'`);
		process.exit(0);
	}

	const fileData = await inputFile.text();
	if (!fileData) throw Error(`Couldn't get text data from file '${inputFilePath}'`);

	console.log(`Loaded Input File: ${inputFilePath.split('/').pop()}`);
	return fileData;
};

// Yoinked GCD and LCM functions
export const gcd = (a: number, b: number): any => {
	if (b == 0) return a;
	return gcd(b, a % b);
};

// Returns LCM of array elements
export function findArrayLCM(arr: number[], length: number) {
	let ans = arr[0];

	for (let i = 1; i < length; i++) {
		ans = (arr[i] * ans) / gcd(arr[i], ans);
	}

	return ans;
}
