import { GetFileData } from '../util';

const inputData = await GetFileData();

const lines = inputData.split('\n');
console.time(`Process Time`);

console.timeEnd(`Process Time`);
