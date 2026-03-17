import { Logger } from '@nestjs/common';

import { createApp } from './app';

const logger = new Logger('Application');

try {
	const { app, configService, appSettings } = await createApp();

	const port = configService.config.API_PORT;
	const host = configService.config.APP_HOST;

	await app.listen(port, host);

	logger.log(`pm2-dashboard api listening on http://${host}:${port}`);

	if (!appSettings.isSetupCompleted()) {
		const setupToken = appSettings.getSetupToken();
		const displayHost = host === '0.0.0.0' || host === '127.0.0.1' ? 'localhost' : host;
		const webPort = configService.config.WEB_PORT || port;

		logger.log(`Setup URL: http://${displayHost}:${webPort}/setup?token=${setupToken}`);
	}
} catch (err: unknown) {
	logger.error('Failed to start application', err);

	process.exit(1);
}
