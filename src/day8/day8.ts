import { GetFileData, findArrayLCM } from '../util';

const inputData = await GetFileData();

const lines = inputData.split('\n');
console.time(`Process Time`);

const directions = lines[0].split('');
console.log(`Directions: ${directions}`);

type Node = {
	left: string;
	right: string;
};

type NodesList = {
	[key: string]: Node;
};

const Nodes: NodesList = {};

// map each line to a node
for (let i = 2; i < lines.length; i++) {
	const NodeName = lines[i].split(' ')[0];
	const LeftNode = lines[i].split(' (')[1].split(',')[0];
	const RightNode = lines[i].split(', ')[1].slice(0, -1);

	Nodes[NodeName as keyof typeof Nodes] = {
		left: LeftNode,
		right: RightNode,
	};
}

const p1 = () => {
	let currentNode = 'AAA';
	let steps = 0;
	let directionIndex = 0;
	// try catch for p2 example input
	try {
		while (currentNode !== 'ZZZ') {
			if (directions.length === directionIndex) {
				directionIndex = 0;
			}
			const direction = directions[directionIndex];
			if (direction === 'L') {
				currentNode = Nodes[currentNode].left;
			} else {
				currentNode = Nodes[currentNode].right;
			}
			steps++;
			directionIndex++;
		}
	} catch (e) {
		console.log(`Part 1 - Reached end of node path.`);
		return -1;
	}
	return steps;
};

const p2 = (node: string) => {
	let steps = 0;
	let directionIndex = 0;
	while (!node.endsWith('Z')) {
		steps += 1;
		if (directions.length === directionIndex) {
			directionIndex = 0;
		}

		if (directions[directionIndex] === 'L') {
			node = Nodes[node].left;
		} else {
			node = Nodes[node].right;
		}
		directionIndex++;
	}
	return steps;
};

const currentNodes = Object.keys(Nodes).filter((key) => key.endsWith('A'));
console.log(`Part 2 - Starting Nodes: ${currentNodes}`);

const lcmList = Object.keys(Nodes)
	.filter((node) => node.endsWith('A'))
	.map((node) => {
		return p2(node);
	})
	.filter(Boolean);

console.log('================');
const p1_answer = p1();
console.log(`Part 1: ${p1_answer === -1 ? 'Likely bad example input' : p1_answer}`);

const p2_answer = findArrayLCM(lcmList, lcmList.length);
console.log(`Part 2: ${p2_answer}`);

console.timeEnd(`Process Time`);
