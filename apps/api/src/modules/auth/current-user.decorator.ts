import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): number => {
	const req = ctx.switchToHttp().getRequest<Request>();

	return req.session.userId!;
});
