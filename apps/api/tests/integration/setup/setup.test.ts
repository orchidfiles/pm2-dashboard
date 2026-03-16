import { randomUUID } from 'crypto';

import { eq } from 'drizzle-orm';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { routes } from '@pm2-dashboard/shared';
import { settings, users } from 'src/database/schema';

import { getApp, getDb } from '../vitest.setup';

const SETUP_TOKEN = randomUUID();

describe('Setup endpoints', () => {
	beforeEach(() => {
		const db = getDb();

		db.delete(users).run();
		db.delete(settings).run();
	});

	describe('GET /api/setup', () => {
		it('returns valid: true with correct token', async () => {
			const db = getDb();

			db.insert(settings).values({ key: 'setup_token', value: SETUP_TOKEN }).run();

			const res = await request(getApp().getHttpServer()).get(routes.setup.checkToken(SETUP_TOKEN));

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ valid: true });
		});

		it('returns valid: false with wrong token', async () => {
			const db = getDb();

			db.insert(settings).values({ key: 'setup_token', value: SETUP_TOKEN }).run();

			const wrongToken = randomUUID();

			const res = await request(getApp().getHttpServer()).get(routes.setup.checkToken(wrongToken));

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ valid: false });
		});

		it('returns 400 without token', async () => {
			const res = await request(getApp().getHttpServer()).get('/api/setup');

			expect(res.status).toBe(400);
		});

		it('returns 400 with non-UUID token', async () => {
			const res = await request(getApp().getHttpServer()).get(routes.setup.checkToken('not-a-uuid'));

			expect(res.status).toBe(400);
		});
	});

	describe('POST /api/setup', () => {
		it('creates user and returns 200 with valid token', async () => {
			const db = getDb();

			db.insert(settings).values({ key: 'setup_token', value: SETUP_TOKEN }).run();

			const res = await request(getApp().getHttpServer())
				.post(routes.setup.complete(SETUP_TOKEN))
				.send({ username: 'admin', password: 'password123' });

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({});
		});

		it('marks setup as completed', async () => {
			const db = getDb();

			db.insert(settings).values({ key: 'setup_token', value: SETUP_TOKEN }).run();

			await request(getApp().getHttpServer())
				.post(routes.setup.complete(SETUP_TOKEN))
				.send({ username: 'admin', password: 'password123' });

			const completed = db.select().from(settings).where(eq(settings.key, 'setup_completed')).get();

			expect(completed?.value).toBe('true');
		});

		it('returns 403 after setup is completed (SetupGuard)', async () => {
			const db = getDb();

			db.insert(settings).values({ key: 'setup_token', value: SETUP_TOKEN }).run();
			db.insert(settings).values({ key: 'setup_completed', value: 'true' }).run();

			const res = await request(getApp().getHttpServer())
				.post(routes.setup.complete(SETUP_TOKEN))
				.send({ username: 'admin', password: 'password123' });

			expect(res.status).toBe(403);
		});

		it('returns 400 with invalid token', async () => {
			const db = getDb();

			db.insert(settings).values({ key: 'setup_token', value: SETUP_TOKEN }).run();

			const wrongToken = randomUUID();

			const res = await request(getApp().getHttpServer())
				.post(routes.setup.complete(wrongToken))
				.send({ username: 'admin', password: 'password123' });

			expect(res.status).toBe(400);
		});

		it('returns 400 with non-UUID token', async () => {
			const res = await request(getApp().getHttpServer())
				.post(routes.setup.complete('not-a-uuid'))
				.send({ username: 'admin', password: 'password123' });

			expect(res.status).toBe(400);
		});
	});
});
