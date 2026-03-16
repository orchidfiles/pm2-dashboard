import { promisify } from 'util';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { DrizzleService } from 'core/app-database/app-database.module';
import { AppSettingsService } from 'core/app-settings/app-settings.module';
import { users } from 'src/database/schema';

import type { Session } from 'express-session';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
	constructor(
		@Inject(DrizzleService) private readonly drizzle: DrizzleService,
		@Inject(AppSettingsService) private readonly appSettings: AppSettingsService
	) {}

	async login(username: string, password: string): Promise<number> {
		const user = this.drizzle.db.select().from(users).where(eq(users.username, username)).get();

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isValid = await compare(password, user.passwordHash);

		if (!isValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return user.id;
	}

	async completeSetup(username: string, password: string): Promise<number> {
		const userId = await this.createUser(username, password);

		this.appSettings.markSetupCompleted();

		return userId;
	}

	async createUser(username: string, password: string): Promise<number> {
		const passwordHash = await hash(password, BCRYPT_ROUNDS);

		const result = this.drizzle.db.insert(users).values({ username, passwordHash }).returning({ id: users.id }).get();

		return result.id;
	}

	getUser(userId: number) {
		const user = this.drizzle.db
			.select({ id: users.id, username: users.username, createdAt: users.createdAt })
			.from(users)
			.where(eq(users.id, userId))
			.get();

		return user ?? null;
	}

	async logout(session: Session): Promise<void> {
		await promisify(session.destroy.bind(session))();
	}
}
