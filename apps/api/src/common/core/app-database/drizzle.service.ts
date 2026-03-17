import { mkdirSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';

import { Inject, Injectable } from '@nestjs/common';
import BetterSqlite3, { type Database as DatabaseType } from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { AppConfigService } from 'core/app-config/app-config.service';
import { schema } from 'src/database/schema';

export type DrizzleDb = BetterSQLite3Database<typeof schema>;

const MIGRATIONS_PATH = join(import.meta.dirname, '../../../../drizzle');

@Injectable()
export class DrizzleService {
	public readonly db: DrizzleDb;
	public readonly sqlite: DatabaseType;

	constructor(@Inject(AppConfigService) configService: AppConfigService) {
		const dbPath = configService.config.DB_PATH || join(homedir(), '.pm2-dashboard', 'data.db');

		mkdirSync(dirname(dbPath), { recursive: true });

		this.sqlite = new BetterSqlite3(dbPath);
		this.db = drizzle(this.sqlite, { schema, casing: 'snake_case' });

		migrate(this.db, { migrationsFolder: MIGRATIONS_PATH });
	}
}
