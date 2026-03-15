import { promisify } from 'util';

import { Injectable } from '@nestjs/common';
import pm2 from 'pm2';

import type { Process, ProcessAction } from '@pm2-dashboard/shared';

const connect = promisify(pm2.connect.bind(pm2));
const disconnect = pm2.disconnect.bind(pm2);
const listRaw = promisify(pm2.list.bind(pm2));

const startRaw = promisify(pm2.start.bind(pm2)) as (id: string) => Promise<unknown>;
const stopRaw = promisify(pm2.stop.bind(pm2)) as (id: string) => Promise<unknown>;
const restartRaw = promisify(pm2.restart.bind(pm2)) as (id: string) => Promise<unknown>;

const actionMap: Record<ProcessAction, (id: string) => Promise<unknown>> = {
	start: startRaw,
	stop: stopRaw,
	restart: restartRaw
};

@Injectable()
export class ProcessesService {
	async list(): Promise<Process[]> {
		try {
			await connect();

			const list = await listRaw();

			const processes: Process[] = list
				.filter((proc) => proc.pm_id !== undefined)
				.map((proc) => ({
					id: proc.pm_id!,
					name: proc.name ?? '',
					status: proc.pm2_env?.status ?? '',
					cpu: proc.monit?.cpu ?? 0,
					memory: proc.monit?.memory ?? 0,
					uptime: proc.pm2_env?.pm_uptime ?? 0,
					restarts: proc.pm2_env?.restart_time ?? 0
				}));

			return processes;
		} finally {
			disconnect();
		}
	}

	async runAction(action: ProcessAction, id: number | string): Promise<void> {
		try {
			await connect();
			await actionMap[action](String(id));
		} finally {
			disconnect();
		}
	}
}
