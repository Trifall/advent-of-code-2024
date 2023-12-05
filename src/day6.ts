import { GetFileData } from './_util';

const filePath = './day6_example.txt';
const inputData = await GetFileData(filePath);
console.log(`Using file: ${filePath}`);

const lines = inputData.split('\n');
console.log(`Found ${lines.length} lines of data`);
