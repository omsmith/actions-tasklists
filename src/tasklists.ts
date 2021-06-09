import {lexer, walkTokens} from 'marked';

export function tokenize(string: string): marked.TokensList {
	return lexer(string);
}

export function tasks(tokens: marked.TokensList) {
	const tasks: Array<{name: string; completed: boolean}> = [];

	walkTokens(tokens, token => {
		if (token.type !== 'list_item') {
			return;
		}

		if (!token.task) {
			return;
		}

		const hack = (token as unknown) as {tokens: Array<{text: string}>};
		tasks.push({name: hack.tokens[0].text, completed: token.checked});
	});

	return tasks;
}
