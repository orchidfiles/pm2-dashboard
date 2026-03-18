import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP');

	use(req: Request, res: Response, next: NextFunction) {
		res.on('finish', () => {
			this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
		});

		next();
	}
}
