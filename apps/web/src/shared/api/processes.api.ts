import { routes } from '@pm2-dashboard/shared/frontend';

import { ApiClient } from './client';

import type { Process, ProcessAction } from '@pm2-dashboard/shared/frontend';

export class ProcessesApi {
	static async fetchProcesses(): Promise<Process[]> {
		return ApiClient.get<Process[]>(routes.processes.list);
	}

	static async performAction(id: number, action: ProcessAction): Promise<void> {
		await ApiClient.post(routes.processes.action(id, action));
	}

	static async bulkAction(action: ProcessAction): Promise<void> {
		await ApiClient.post(routes.processes.bulkAction(action));
	}
}
