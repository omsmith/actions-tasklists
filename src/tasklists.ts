import {lexer, walkTokens} from 'marked';

import type {Except} from 'type-fest';

export function tokenize(string: string) {
	return lexer(string);
}

export function tasks(tokens: any[]) {
	const tasks: { name: string[], completed: boolean }[] = [];

	walkTokens(tokens, token => {
		if (token.type !== 'list_item') {
			return;
		}

		if (!token.task) {
			return;
		}

		tasks.push({name: token.tokens[0].text, completed: token.checked});
	});

	return tasks;
}
