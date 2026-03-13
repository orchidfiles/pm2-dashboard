import fs from 'node:fs';
import path from 'node:path';

import { config } from 'dotenv';

export class Infra {
	static loadEnv() {
		process.env.NODE_ENV ??= 'development';

		const infraRoot = this.findInfraRoot();

		if (!infraRoot) {
			throw new Error(`infra/env not found near: ${process.cwd()}`);
		}

		const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.local';
		const envPath = path.join(infraRoot, 'env', envFile);

		if (!fs.existsSync(envPath)) {
			throw new Error(`Env file not found: ${envPath}`);
		}

		config({ path: envPath });
	}

	private static findInfraRoot(): string | null {
		let dir = process.cwd();

		for (let i = 0; i < 5; i++) {
			const candidate = path.resolve(dir, 'infra', 'env');

			if (fs.existsSync(candidate)) {
				return path.resolve(dir, 'infra');
			}

			dir = path.dirname(dir);
		}

		return null;
	}
}
