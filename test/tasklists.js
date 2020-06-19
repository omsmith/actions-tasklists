'use strict';

const test = require('ava');

const { tokenize, tasks: taskify } = require('../src/tasklists.ts');

test('no tasks', t => {
	const tasks = taskify(tokenize(`
The quick brown fox jumps over the lazy dog
* There is a brown fox
  * It is quick
* There is a dog
  * It is lazy
`));

	t.deepEqual(tasks, []);
});

test('1 task', t => {
	const tasks = taskify(tokenize(`
The quick brown fox jumps over the lazy dog
* [ ] Paint the fox brown
`));

	t.deepEqual(tasks, [{
		name: 'Paint the fox brown', completed: false,
	}]);
});

test('nested tasks', t => {
	const tasks = taskify(tokenize(`
The quick brown fox jumps over the lazy dog
* [ ] Paint the fox brown
  * [ ] Get a brush
  * [ ] Get brown paint
  * [ ] Combine
`));

	t.deepEqual(tasks, [{
		name: 'Paint the fox brown', completed: false,
	}, {
		name: 'Get a brush', completed: false,
	}, {
		name: 'Get brown paint', completed: false,
	}, {
		name: 'Combine', completed: false,
	}]);
});

test('nested with tabs', t => {
	const tasks = taskify(tokenize(`
The quick brown fox jumps over the lazy dog
* [ ] Paint the fox brown
	* [ ] Get a brush
	* [ ] Get brown paint
	* [ ] Combine
`));

	t.deepEqual(tasks, [{
		name: 'Paint the fox brown', completed: false,
	}, {
		name: 'Get a brush', completed: false,
	}, {
		name: 'Get brown paint', completed: false,
	}, {
		name: 'Combine', completed: false,
	}]);
});

test('multiple lists', t => {
	const tasks = taskify(tokenize(`
The quick brown fox jumps over the lazy dog
* [ ] Paint the fox brown
  * [ ] Get a brush
  * [ ] Get brown paint
  * [ ] Combine


The quick brown fox jumps over the lazy dog
- [ ] Paint the fox brown
  - [ ] Get a brush
  - [ ] Get brown paint
  - [ ] Combine
`));

	t.deepEqual(tasks, [{
		name: 'Paint the fox brown', completed: false,
	}, {
		name: 'Get a brush', completed: false,
	}, {
		name: 'Get brown paint', completed: false,
	}, {
		name: 'Combine', completed: false,
	}, {
		name: 'Paint the fox brown', completed: false,
	}, {
		name: 'Get a brush', completed: false,
	}, {
		name: 'Get brown paint', completed: false,
	}, {
		name: 'Combine', completed: false,
	}]);
});

test('completed task', t => {
	const tasks = taskify(tokenize(`
The quick brown fox jumps over the lazy dog
* [x] Paint the fox brown
`));

	t.deepEqual(tasks, [{
		name: 'Paint the fox brown', completed: true,
	}]);
});

