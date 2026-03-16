import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Infra } from '@pm2-dashboard/shared';
import { AppConfigService } from 'core/app-config/app-config.service';
import { AppSettingsService } from 'core/app-settings/app-settings.module';
import { SqliteSessionStore } from 'src/database';

import { AppModule } from './app.module';
import { AppBootstrap } from './bootstrap';

Infra.loadEnv();

class Application {
	private app: NestExpressApplication;
	private configService: AppConfigService;
	private appSettings: AppSettingsService;
	private readonly logger = new Logger(Application.name);

	public async initialize() {
		try {
			this.app = await NestFactory.create<NestExpressApplication>(AppModule);

			this.configService = this.app.get(AppConfigService);
			this.appSettings = this.app.get(AppSettingsService);

			const secret = this.appSettings.getSessionSecret();

			AppBootstrap.configureSession(this.app, this.configService, this.app.get(SqliteSessionStore), secret);
			AppBootstrap.configureApp(this.app, this.configService);

			await this.startServer();
		} catch (err: unknown) {
			this.logger.error('Failed to start application', err);

			process.exit(1);
		}
	}

	private async startServer() {
		const port = this.configService.config.API_PORT;
		const host = this.configService.config.APP_HOST;

		await this.app.listen(port, host);

		this.logger.log(`pm2-dashboard api listening on http://${host}:${port}`);

		this.logSetupUrl(port, host);
	}

	private logSetupUrl(port: number, host: string) {
		if (this.appSettings.isSetupCompleted()) {
			return;
		}

		const setupToken = this.appSettings.getSetupToken();
		const displayHost = host === '0.0.0.0' ? 'localhost' : host;

		this.logger.log(`Setup URL: http://${displayHost}:${port}/setup?token=${setupToken}`);
	}
}

void new Application().initialize();
