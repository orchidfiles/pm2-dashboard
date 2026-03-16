import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import type { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest<Request>();

		if (!req.session?.userId) {
			throw new UnauthorizedException();
		}

		return true;
	}
}
