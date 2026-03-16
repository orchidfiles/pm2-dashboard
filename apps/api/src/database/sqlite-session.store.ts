import { Inject, Injectable } from '@nestjs/common';
import { Store, type SessionData } from 'express-session';

import { AppConfigService } from 'core/app-config/app-config.service';
import { DrizzleService } from 'core/app-database/app-database.module';

@Injectable()
export class SqliteSessionStore extends Store {
	constructor(
		@Inject(DrizzleService) private readonly drizzleService: DrizzleService,
		@Inject(AppConfigService) private readonly appConfig: AppConfigService
	) {
		super();
	}

	get(sid: string, callback: (err: unknown, session?: SessionData | null) => void): void {
		try {
			const now = Math.floor(Date.now() / 1000);
			const row = this.drizzleService.sqlite.prepare('SELECT sess FROM sessions WHERE sid = ? AND expired > ?').get(sid, now) as
				| { sess: string }
				| undefined;

			if (!row) {
				callback(null, null);

				return;
			}

			const session = JSON.parse(row.sess) as SessionData;

			callback(null, session);
		} catch (err) {
			callback(err);
		}
	}

	set(sid: string, session: SessionData, callback?: (err?: unknown) => void): void {
		try {
			const expired = this.getExpiredAt(session);
			const sess = JSON.stringify(session);

			this.drizzleService.sqlite
				.prepare('INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)')
				.run(sid, sess, expired);

			if (callback) {
				callback();
			}
		} catch (err) {
			if (callback) {
				callback(err);
			}
		}
	}

	destroy(sid: string, callback?: (err?: unknown) => void): void {
		try {
			this.drizzleService.sqlite.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);

			if (callback) {
				callback();
			}
		} catch (err) {
			if (callback) {
				callback(err);
			}
		}
	}

	touch(sid: string, session: SessionData, callback?: (err?: unknown) => void): void {
		try {
			const expired = this.getExpiredAt(session);

			this.drizzleService.sqlite.prepare('UPDATE sessions SET expired = ? WHERE sid = ?').run(expired, sid);

			if (callback) {
				callback();
			}
		} catch (err) {
			if (callback) {
				callback(err);
			}
		}
	}

	private getExpiredAt(session: SessionData): number {
		const maxAgeMs = session.cookie?.maxAge ?? this.appConfig.sessionMaxAgeMs;

		return Math.floor(Date.now() / 1000) + Math.floor(maxAgeMs / 1000);
	}
}
