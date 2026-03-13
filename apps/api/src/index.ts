import { Infra } from '@pm2-dashboard/shared';
import express from 'express';
import pm2 from 'pm2';

Infra.loadEnv();

const app = express();
app.use(express.json());

const PORT = Number(process.env.API_PORT) || 3100;
const HOST = process.env.HOST ?? '127.0.0.1';

type ProcessAction = 'start' | 'stop' | 'restart';

function runAction(action: ProcessAction, id: number | string): Promise<void> {
	return new Promise((resolve, reject) => {
		pm2.connect((err) => {
			if (err) {
				reject(err);

				return;
			}

			pm2[action](id as string, (actionErr) => {
				pm2.disconnect();

				if (actionErr) {
					reject(actionErr);

					return;
				}

				resolve();
			});
		});
	});
}

const ALLOWED_ACTIONS: ProcessAction[] = ['start', 'stop', 'restart'];

app.post('/api/processes/:id/:action', async (req, res) => {
	const id = Number(req.params.id);
	const action = req.params.action as ProcessAction;

	if (!ALLOWED_ACTIONS.includes(action)) {
		res.status(400).json({ error: `Unknown action: ${action}` });

		return;
	}

	try {
		await runAction(action, id);
		res.json({ ok: true });
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Unknown error';

		res.status(500).json({ error: message });
	}
});

app.post('/api/processes/bulk', async (req, res) => {
	const { action, ids } = req.body as { action: ProcessAction; ids: number[] };

	if (!ALLOWED_ACTIONS.includes(action)) {
		res.status(400).json({ error: `Unknown action: ${action}` });

		return;
	}

	if (!Array.isArray(ids) || ids.length === 0) {
		res.status(400).json({ error: 'ids must be a non-empty array' });

		return;
	}

	const results = await Promise.allSettled(ids.map((id) => runAction(action, id)));

	const errors = results
		.map((r, i) => {
			if (r.status === 'rejected') {
				const message = r.reason instanceof Error ? r.reason.message : 'Unknown error';

				return { id: ids[i], error: message };
			}

			return null;
		})
		.filter(Boolean);

	if (errors.length > 0) {
		res.status(207).json({ ok: false, errors });

		return;
	}

	res.json({ ok: true });
});

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
