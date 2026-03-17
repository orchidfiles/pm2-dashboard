import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { millisecondsInDay } from 'date-fns/constants';

import { Infra } from '@pm2-dashboard/shared';

import { EnvVariables } from './env.config';

@Injectable()
export class AppConfigService {
	private readonly envConfig: EnvVariables;

	constructor() {
		if (process.env.NODE_ENV === 'development') {
			Infra.loadEnv();
		}

		const keys: (keyof EnvVariables)[] = ['NODE_ENV', 'API_PORT', 'WEB_PORT', 'APP_HOST', 'DB_PATH'];

		const raw = Object.fromEntries(keys.filter((key) => process.env[key] !== undefined).map((key) => [key, process.env[key]]));

		const instance = plainToInstance(EnvVariables, raw, { enableImplicitConversion: true });
		const errors = validateSync(instance, { skipMissingProperties: false });

		if (errors.length > 0) {
			const messages = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('\n');

			throw new Error(`Config validation error:\n${messages}`);
		}

		this.envConfig = instance;
	}

	get config(): EnvVariables {
		return this.envConfig;
	}

	get sessionMaxAgeMs(): number {
		return 30 * millisecondsInDay;
	}
}
