import 'reflect-metadata';

import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppConfigService } from 'core/app-config/app-config.service';
import { AppSettingsService } from 'core/app-settings/app-settings.module';
import { SqliteSessionStore } from 'src/database';

import { AppModule } from './app.module';
import { AppBootstrap } from './bootstrap';

export interface AppInstance {
	app: NestExpressApplication;
	configService: AppConfigService;
	appSettings: AppSettingsService;
}

export async function createApp(): Promise<AppInstance> {
	const options: NestApplicationOptions = {};

	if (process.env.NODE_ENV === 'production') {
		options.logger = false;
	}

	const app = await NestFactory.create<NestExpressApplication>(AppModule, options);

	const configService = app.get(AppConfigService);
	const appSettings = app.get(AppSettingsService);
	const secret = appSettings.getSessionSecret();

	AppBootstrap.configureSession(app, configService, app.get(SqliteSessionStore), secret);
	AppBootstrap.configureApp(app, configService);

	return { app, configService, appSettings };
}
