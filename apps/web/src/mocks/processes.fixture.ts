import { millisecondsInDay, millisecondsInHour } from 'date-fns/constants';

import type { Process } from '@pm2-dashboard/shared/frontend';

export const processesMock: Process[] = [
	{
		id: 1,
		name: 'frontend',
		status: 'online',
		cpu: 0.3,
		memory: 67108864,
		uptime: Date.now() - millisecondsInDay * 3,
		restarts: 1
	},
	{
		id: 2,
		name: 'api',
		status: 'online',
		cpu: 12.4,
		memory: 188743680,
		uptime: Date.now() - millisecondsInDay * 3,
		restarts: 2
	},
	{
		id: 3,
		name: 'worker',
		status: 'online',
		cpu: 45.1,
		memory: 440401920,
		uptime: Date.now() - millisecondsInHour * 5,
		restarts: 0
	},
	{
		id: 4,
		name: 'mailer',
		status: 'stopped',
		cpu: 0,
		memory: 0,
		uptime: 0,
		restarts: 17
	}
];
