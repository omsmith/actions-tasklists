export function requireEnv(name: string): string {
	const result = process.env[name];
	if (result === undefined) {
		throw new Error(`Expected environment "${name}" to be available`);
	}

	return result;
}
