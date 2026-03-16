import { randomBytes, randomUUID } from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DrizzleService } from 'core/app-database/app-database.module';
import { SettingKey } from 'core/enums';
import { settings } from 'src/database/schema';

@Injectable()
export class AppSettingsService {
	constructor(@Inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	public getSessionSecret(): string {
		return this.getOrCreate(SettingKey.SessionSecret, () => randomBytes(48).toString('hex'));
	}

	public isSetupCompleted(): boolean {
		return this.get(SettingKey.SetupCompleted) === 'true';
	}

	public getSetupToken(): string {
		return this.getOrCreate(SettingKey.SetupToken, () => randomUUID());
	}

	public isValidSetupToken(token: string): boolean {
		const stored = this.get(SettingKey.SetupToken);

		return stored === token;
	}

	public markSetupCompleted(): void {
		this.set(SettingKey.SetupCompleted, 'true');
		this.delete(SettingKey.SetupToken);
	}

	private get(key: SettingKey): string | null {
		const row = this.drizzle.db.select().from(settings).where(eq(settings.key, key)).get();

		return row?.value ?? null;
	}

	private getOrCreate(key: SettingKey, generate: () => string): string {
		const existing = this.get(key);

		if (existing !== null) {
			return existing;
		}

		const value = generate();

		this.drizzle.db.insert(settings).values({ key, value }).run();

		return value;
	}

	private set(key: SettingKey, value: string): void {
		this.drizzle.db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } }).run();
	}

	private delete(key: SettingKey): void {
		this.drizzle.db.delete(settings).where(eq(settings.key, key)).run();
	}
}
