import {env} from 'process';

export function requireEnv(name: string): string {
	const result = env[name];
	if (result === undefined) {
		throw new Error(`Expected environment "${name}" to be available`);
	}

	return result;
}
