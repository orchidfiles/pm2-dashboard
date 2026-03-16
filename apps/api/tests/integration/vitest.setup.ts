import 'reflect-metadata';

import { join } from 'path';

import { Global, Module, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { afterAll, beforeAll } from 'vitest';

import { AppConfigModule } from 'core/app-config/app-config.module';
import { AppConfigService } from 'core/app-config/app-config.service';
import { DrizzleService, type DrizzleDb } from 'core/app-database/app-database.module';
import { AppSettingsModule } from 'core/app-settings/app-settings.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AppBootstrap } from 'src/bootstrap';
import { schema } from 'src/database/schema';
import { SqliteSessionStore } from 'src/database/sqlite-session.store';

const migrationsFolder = join(import.meta.dirname, '../../src/database/migrations');

let sqliteDb: InstanceType<typeof Database>;
let drizzleDb: DrizzleDb;
let nestApp: INestApplication;

export function getApp(): INestApplication {
	return nestApp;
}

export function getDb(): DrizzleDb {
	return drizzleDb;
}

beforeAll(async () => {
	process.env.NODE_ENV = 'test';

	sqliteDb = new Database(':memory:');
	drizzleDb = drizzle(sqliteDb, { schema, casing: 'snake_case' });

	migrate(drizzleDb, { migrationsFolder });

	const mockDrizzleService = { db: drizzleDb, sqlite: sqliteDb } as DrizzleService;

	@Global()
	@Module({
		providers: [{ provide: DrizzleService, useValue: mockDrizzleService }, SqliteSessionStore],
		exports: [DrizzleService, SqliteSessionStore]
	})
	class TestDatabaseModule {}

	const moduleRef = await Test.createTestingModule({
		imports: [AppConfigModule, TestDatabaseModule, AppSettingsModule, AuthModule]
	}).compile();

	nestApp = moduleRef.createNestApplication();

	const configService = nestApp.get(AppConfigService);
	const store = nestApp.get(SqliteSessionStore);

	AppBootstrap.configureSession(nestApp, configService, store, 'test-secret');
	AppBootstrap.configureApp(nestApp, configService);

	await nestApp.init();
});

afterAll(async () => {
	if (nestApp) {
		await nestApp.close();
	}

	if (sqliteDb) {
		sqliteDb.close();
	}
});
