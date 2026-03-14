#!/usr/bin/env node
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command, InvalidArgumentError } from 'commander';
import express from 'express';

import { app } from '../dist/api/app.js';

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
app.use(express.static(join(currentDir, '../dist/web')));

const config = RuntimeConfig.resolveConfig();

const program = new Command();
program.name('pm2-dashboard');
program.description('Self-hosted web dashboard for PM2');
program.option('--port <port>', 'Port to listen on', RuntimeConfig.parsePort, config.port);
program.option('--host <host>', 'Host interface to bind', RuntimeConfig.parseHost, config.host);
program.parse();

const options = program.opts();

app.listen(options.port, options.host, () => {
	console.log(`pm2-dashboard listening on http://${options.host}:${options.port}`);
}).on('error', (err) => {
	console.error(`Failed to start: ${err.message}`);
	process.exit(1);
});
