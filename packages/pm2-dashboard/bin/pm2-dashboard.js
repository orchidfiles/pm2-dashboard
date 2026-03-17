#!/usr/bin/env node
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command, InvalidArgumentError } from 'commander';
import express from 'express';

import { createApp } from '../dist/api/app.js';

class RuntimeConfig {
	static resolveConfig() {
		const config = {
			port: 3000,
			host: '127.0.0.1',
		};

		if (process.env.PORT) {
			config.port = this.parsePort(process.env.PORT);
		}

		if (process.env.HOST) {
			config.host = this.parseHost(process.env.HOST);
		}

		return config;
	}

	static parseHost(value) {
		if (!value || value.trim() === '') {
			throw new InvalidArgumentError('Host must not be empty.');
		}

		return value.trim();
	}

	static parsePort(value) {
		const portValue = Number(value);

		if (!Number.isInteger(portValue) || portValue < 1 || portValue > 65535) {
			throw new InvalidArgumentError('Port must be an integer between 1 and 65535.');
		}

		return portValue;
	}
}

const currentDir = dirname(fileURLToPath(import.meta.url));
const config = RuntimeConfig.resolveConfig();

const program = new Command();
program.name('pm2-dashboard');
program.description('Self-hosted web dashboard for PM2');
program.option('--port <port>', 'Port to listen on', RuntimeConfig.parsePort, config.port);
program.option('--host <host>', 'Host interface to bind', RuntimeConfig.parseHost, config.host);
program.option('--db <path>', 'Path to SQLite database file');
program.parse();

const options = program.opts();

process.env.API_PORT = String(options.port);
process.env.APP_HOST = options.host;
process.env.NODE_ENV = 'production';

if (options.db) {
	process.env.DB_PATH = options.db;
}

const { app, configService, appSettings } = await createApp();

const webDistPath = join(currentDir, '../dist/web');

app.use(express.static(webDistPath));
app.use((req, res, next) => {
	if (req.path.startsWith('/api')) {
		next();
		return;
	}

	res.sendFile(join(webDistPath, 'index.html'));
});

const port = configService.config.API_PORT;
const host = configService.config.APP_HOST;

await app.listen(port, host);

console.log(`pm2-dashboard listening on http://${host}:${port}`);

if (!appSettings.isSetupCompleted()) {
	const setupToken = appSettings.getSetupToken();
	const displayHost = host === '0.0.0.0' || host === '127.0.0.1' ? 'localhost' : host;

	console.log(`Setup URL: http://${displayHost}:${port}/setup?token=${setupToken}`);
}
