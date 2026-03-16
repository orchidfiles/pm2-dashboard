import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
	createdAt: integer({ mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer({ mode: 'timestamp' }),
	deletedAt: integer({ mode: 'timestamp' })
};

export const users = sqliteTable('users', {
	id: integer().primaryKey({ autoIncrement: true }),
	username: text().notNull().unique(),
	passwordHash: text().notNull(),
	...timestamps
});

export const settings = sqliteTable('settings', {
	key: text().primaryKey(),
	value: text().notNull()
});

export const sessions = sqliteTable('sessions', {
	sid: text().primaryKey(),
	sess: text().notNull(),
	expired: integer().notNull()
});

export const schema = { users, settings, sessions };
