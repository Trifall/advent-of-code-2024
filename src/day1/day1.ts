import { GetFileData } from '../util';

const inputData = await GetFileData();

const splitData = inputData.split('\n');

console.log(splitData);
