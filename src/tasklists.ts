import {marked} from 'marked';

export function tokenize(string: string): marked.TokensList {
	return marked.lexer(string);
}

export function tasks(tokens: marked.TokensList) {
	const tasks: Array<{name: string; completed: boolean}> = [];

	marked.walkTokens(tokens, token => {
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
