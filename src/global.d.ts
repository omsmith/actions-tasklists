export const __PLACEHODLER = 'hacks';

declare global {
	namespace marked {
		namespace Tokens {
			interface ListItemStart {
				type: 'list_item_start';
				task?: boolean;
				checked?: boolean;
			}
		}
	}

	interface PayloadRepository {
		[key: string]: any;
		full_name?: string;
		name: string;
		owner: {
			[key: string]: any;
			login: string;
			name?: string;
		};
		html_url?: string;
	}
	interface WebhookPayload {
		[key: string]: any;
		repository?: PayloadRepository;
		issue?: {
			[key: string]: any;
			number: number;
			html_url?: string;
			body?: string;
		};
		pull_request?: {
			[key: string]: any;
			number: number;
			html_url?: string;
			body?: string;
			head: {
				sha: string;
			};
		};
		sender?: {
			[key: string]: any;
			type: string;
		};
		action?: string;
		installation?: {
			[key: string]: any;
			id: number;
		};
	}

}
