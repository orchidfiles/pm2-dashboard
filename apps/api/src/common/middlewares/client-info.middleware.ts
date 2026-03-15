import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface ClientInfoRequest extends Request {
	clientIp?: string;
	clientUserAgent?: string;
}

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
	use(req: Request & ClientInfoRequest, _res: Response, next: NextFunction) {
		const forwarded = req.headers['x-forwarded-for'];
		const realIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

		req.clientIp = realIp ?? undefined;
		req.clientUserAgent = req.headers['user-agent'];

		next();
	}
}
