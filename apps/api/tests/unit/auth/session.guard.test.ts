import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { SessionGuard } from 'common/guards/session.guard';

function createMockContext(userId?: number): ExecutionContext {
	return {
		switchToHttp: () => ({
			getRequest: () => ({
				session: userId !== undefined ? { userId } : {}
			})
		})
	} as unknown as ExecutionContext;
}

describe('SessionGuard', () => {
	const guard = new SessionGuard();

	it('returns true when session has userId', () => {
		const ctx = createMockContext(1);

		expect(guard.canActivate(ctx)).toBe(true);
	});

	it('throws UnauthorizedException when session has no userId', () => {
		const ctx = createMockContext();

		expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
	});
});
