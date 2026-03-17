import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

export class Infra {
	static loadEnv() {
		process.env.NODE_ENV ??= 'development';

		const envDir = this.findInfraEnvDir();
		const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.local';
		const envPath = path.join(envDir, envFile);

		if (!fs.existsSync(envPath)) {
			throw new Error(`Env file not found: ${envPath}`);
		}

		const { config } = require('dotenv') as typeof import('dotenv');

		config({ path: envPath });
	}

	static findInfraEnvDir(): string {
		let dir = process.cwd();

		for (let i = 0; i < 5; i++) {
			const candidate = path.resolve(dir, 'infra', 'env');

			if (fs.existsSync(candidate)) {
				return candidate;
			}

			dir = path.dirname(dir);
		}

		throw new Error(`infra/env not found near: ${process.cwd()}`);
	}
}
