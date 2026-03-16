import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/database/schema.ts',
	out: './src/database/migrations',
	dialect: 'sqlite',
	casing: 'snake_case',
	migrations: { prefix: 'index' }
});
