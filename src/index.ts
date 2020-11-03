import {promises as fs} from 'fs';
const {readFile} = fs;

import {getInput, info, setFailed} from '@actions/core';
import {getOctokit} from '@actions/github';
import {
	GetResponseTypeFromEndpointMethod as GetResponseType
} from '@octokit/types';

import {tasks, tokenize} from './tasklists';
import {requireEnv} from './util';

const GITHUB_EVENT_PATH = requireEnv('GITHUB_EVENT_PATH');

async function getEventDetails() {
	const event: WebhookPayload = JSON.parse(await readFile(GITHUB_EVENT_PATH, 'utf8'));
	if (!event.pull_request) {
		info('Not a pull_request event. Skipping');
		return;
	}

	const body = event.pull_request.body;
	const repo = event.repository.name;
	const owner = event.repository.owner.login;
	const sha = event.pull_request.head?.sha;

	return {body, repo, owner, sha};
}

async function main() {
	const token = getInput('github_token', {required: true});
	const reportTasks = getInput('report_tasks') === 'true';

	const octokit = getOctokit(token);

	const details = await getEventDetails();
	if (!details) {
		return;
	}

	const {body, repo, owner, sha} = details;

	const danglingTasksNames: Set<string> = new Set();
	if (reportTasks) {
		const existingStatuses = await octokit.repos.listCommitStatusesForRef({repo, owner, ref: sha});
		existingStatuses
			.data
			.map((item: { context: string }) => item.context)
			.filter(name => name.startsWith('Tasklists Task:'))
			.forEach(name => danglingTasksNames.add(name));
	}

	const statusP: Array<Promise<GetResponseType<typeof octokit.repos.createCommitStatus>>> = [];

	let completedCount = 0;
	let totalCount = 0;
	for (const task of tasks(tokenize(body))) {
		++totalCount;
		if (task.completed) {
			++completedCount;
		}

		if (reportTasks) {
			const name = `Tasklists Task: ${task.name}`;
			danglingTasksNames.delete(name);
			statusP.push(octokit.repos.createCommitStatus({
				repo, owner, sha,

				context: name,
				state: task.completed ? 'success' : 'pending'
			}));
		}
	}

	for (const name of danglingTasksNames.values()) {
		statusP.push(octokit.repos.createCommitStatus({
			repo, owner, sha,

			context: name,
			description: 'Removed',
			state: 'error'
		}));
	}

	const completed = completedCount === totalCount;
	statusP.push(octokit.repos.createCommitStatus({
		repo, owner, sha,

		context: 'Tasklists: Completed',
		description: totalCount === 0 ?
			'No tasks' :
			`${completedCount} of ${totalCount} tasks`,
		state: completed ? 'success' : 'pending'
	}));

	await Promise.all(statusP);
}

main().catch((error: Readonly<Error>) => setFailed(`Run failed: ${error.message}`));
