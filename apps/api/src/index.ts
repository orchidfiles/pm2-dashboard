import { Infra } from '@pm2-dashboard/shared';
import express from 'express';
import pm2 from 'pm2';

Infra.loadEnv();

const app = express();
const PORT = Number(process.env.API_PORT) || 3100;
const HOST = process.env.HOST ?? '127.0.0.1';

app.get('/api/processes', (_req, res) => {
	pm2.connect((err) => {
		if (err) {
			res.status(500).json({ error: err.message });

			return;
		}

		pm2.list((listErr, list) => {
			pm2.disconnect();

			if (listErr) {
				res.status(500).json({ error: listErr.message });

				return;
			}

			const processes = list.map((proc) => ({
				id: proc.pm_id,
				name: proc.name,
				status: proc.pm2_env?.status,
				cpu: proc.monit?.cpu,
				memory: proc.monit?.memory,
				uptime: proc.pm2_env?.pm_uptime,
				restarts: proc.pm2_env?.restart_time
			}));

			res.json(processes);
		});
	});
});

app.listen(PORT, HOST, () => {
	console.log(`pm2-dashboard api listening on http://${HOST}:${PORT}`);
});
