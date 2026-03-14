import { Infra } from '@pm2-dashboard/shared';

import { app } from './app';

Infra.loadEnv();

const PORT = Number(process.env.API_PORT) || 3100;
const HOST = process.env.HOST ?? '127.0.0.1';

app.listen(PORT, HOST, () => {
	console.log(`pm2-dashboard api listening on http://${HOST}:${PORT}`);
});
