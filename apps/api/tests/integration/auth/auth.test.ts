import { eq } from 'drizzle-orm';
import request from 'supertest';
import { describe, expect, it, beforeEach } from 'vitest';

import { routes } from '@pm2-dashboard/shared';
import { AuthService } from 'modules/auth/auth.service';
import { users } from 'src/database/schema';

import { getApp, getDb } from '../vitest.setup';

describe('Auth endpoints', () => {
	let authService: AuthService;

	beforeEach(() => {
		const db = getDb();

		db.delete(users).run();

		authService = getApp().get(AuthService);
	});

	describe('POST /api/auth/login', () => {
		it('returns 200 with valid credentials', async () => {
			await authService.createUser('admin', 'password123');

			const res = await request(getApp().getHttpServer())
				.post(routes.auth.login)
				.send({ username: 'admin', password: 'password123' });

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({});
		});

		it('returns 401 with invalid password', async () => {
			await authService.createUser('admin', 'password123');

			const res = await request(getApp().getHttpServer())
				.post(routes.auth.login)
				.send({ username: 'admin', password: 'wrongpass1' });

			expect(res.status).toBe(401);
		});

		it('returns 401 with unknown username', async () => {
			const res = await request(getApp().getHttpServer())
				.post(routes.auth.login)
				.send({ username: 'nobody', password: 'password123' });

			expect(res.status).toBe(401);
		});
	});

	describe('GET /api/auth/me', () => {
		it('returns 401 without session', async () => {
			const res = await request(getApp().getHttpServer()).get(routes.auth.me);

			expect(res.status).toBe(401);
		});

		it('returns user with valid session', async () => {
			await authService.createUser('admin', 'password123');

			const agent = request.agent(getApp().getHttpServer());

			await agent.post(routes.auth.login).send({ username: 'admin', password: 'password123' });

			const res = await agent.get(routes.auth.me);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ username: 'admin' });
		});
	});

	describe('POST /api/auth/logout', () => {
		it('returns 401 without session', async () => {
			const res = await request(getApp().getHttpServer()).post(routes.auth.logout);

			expect(res.status).toBe(401);
		});

		it('destroys session after logout', async () => {
			await authService.createUser('admin', 'password123');

			const agent = request.agent(getApp().getHttpServer());

			await agent.post(routes.auth.login).send({ username: 'admin', password: 'password123' });

			const logoutRes = await agent.post(routes.auth.logout);

			expect(logoutRes.status).toBe(200);

			const meRes = await agent.get(routes.auth.me);

			expect(meRes.status).toBe(401);
		});
	});
});
