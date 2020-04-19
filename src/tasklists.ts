import {lexer} from 'marked';

import type {Except} from 'type-fest';

export function tokenize(string: string) {
	return lexer(string);
}

export function * tasks(tokens: Readonly<Except<marked.TokensList, 'links'>>) {
	for (let i = 0; i < tokens.length - 2; ++i) {
		const token = tokens[i];
		if (token.type !== 'list_item_start') {
			continue;
		}

		if (!token.task) {
			continue;
		}

		const nextToken = tokens[i + 1];
		if (nextToken.type !== 'text') {
			continue;
		}

		yield {name: nextToken.text, completed: token.checked};
	}
}
