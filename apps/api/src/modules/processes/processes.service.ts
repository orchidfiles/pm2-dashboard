import { promisify } from 'util';

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import pm2 from 'pm2';

import { ProcessAction, type Process } from '@pm2-dashboard/shared';

const connect = promisify(pm2.connect.bind(pm2));
const listRaw = promisify(pm2.list.bind(pm2));

const startRaw = promisify(pm2.start.bind(pm2)) as (id: string) => Promise<unknown>;
const stopRaw = promisify(pm2.stop.bind(pm2)) as (id: string) => Promise<unknown>;
const restartRaw = promisify(pm2.restart.bind(pm2)) as (id: string) => Promise<unknown>;

const actionMap: Record<ProcessAction, (id: string) => Promise<unknown>> = {
	[ProcessAction.Start]: startRaw,
	[ProcessAction.Stop]: stopRaw,
	[ProcessAction.Restart]: restartRaw
};

@Injectable()
export class ProcessesService implements OnModuleInit, OnModuleDestroy {
	async onModuleInit(): Promise<void> {
		await connect();
	}

	onModuleDestroy(): void {
		pm2.disconnect();
	}

	async list(): Promise<Process[]> {
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
	}

	async runAction(action: ProcessAction, id: number | string): Promise<void> {
		await actionMap[action](String(id));
	}

	async runAll(action: ProcessAction): Promise<void> {
		await actionMap[action]('all');
	}
}
