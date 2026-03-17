import { routes } from '@pm2-dashboard/shared/frontend';

import { ApiClient } from './client';

import type { ActionResult, AuthUser, CheckTokenResult, SetupStatusResult } from '@pm2-dashboard/shared/frontend';

export class AuthApi {
	static async getMe(): Promise<AuthUser | null> {
		return await ApiClient.getOrNull<AuthUser>(routes.auth.me);
	}

	static async login(username: string, password: string): Promise<void> {
		await ApiClient.post<ActionResult>(routes.auth.login, { username, password });
	}

	static async logout(): Promise<void> {
		await ApiClient.post<ActionResult>(routes.auth.logout);
	}

	static async getSetupStatus(): Promise<SetupStatusResult> {
		return await ApiClient.get<SetupStatusResult>(routes.setup.status);
	}

	static async checkSetupToken(token: string): Promise<boolean> {
		try {
			const body = await ApiClient.get<CheckTokenResult>(routes.setup.checkToken(token));

			return body.valid;
		} catch {
			return false;
		}
	}

	static async completeSetup(token: string, username: string, password: string): Promise<void> {
		await ApiClient.post<ActionResult>(routes.setup.complete(token), { username, password });
	}
}
