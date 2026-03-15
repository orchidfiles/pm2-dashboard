import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AppConfigService } from 'core/app-config/app-config.service';
import { NodeEnv } from 'enums';

interface ExceptionResponse {
	error: string | number;
	message: string | string[];
}

interface HttpExceptionDto {
	statusCode: number;
	error: string | number;
	message: string | string[];
	errors?: unknown[];
}

interface ExceptionResponseFull extends HttpExceptionDto {
	method: string;
	path: string;
	timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly configService: AppConfigService) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		console.error(exception);

		const errorResponse: HttpExceptionDto = {
			statusCode: status,
			error: 'Internal Server Error',
			message: 'An unexpected error occurred'
		};

		if (exception instanceof BadRequestException) {
			const exceptionResponse = exception.getResponse() as ExceptionResponse;

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				errorResponse.error = exceptionResponse.error ?? 'Bad Request';

				if (Array.isArray(exceptionResponse.message)) {
					errorResponse.message = 'Validation failed';
					errorResponse.errors = exceptionResponse.message;
				} else {
					errorResponse.message = exceptionResponse.message ?? 'An error occurred';
				}
			}
		} else if (exception instanceof UnauthorizedException) {
			const exceptionResponse = exception.getResponse() as ExceptionResponse;

			errorResponse.statusCode = exception.getStatus();
			errorResponse.error = 'Unauthorized';

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				errorResponse.message = exceptionResponse.message ?? 'Unauthorized';
				errorResponse.error = exceptionResponse.error ?? 'Unauthorized';
			}
		} else if (exception instanceof InternalServerErrorException) {
			errorResponse.message = 'Internal Server Error';
			errorResponse.error = 'Error';
		} else if (exception instanceof HttpException) {
			const exceptionResponse = exception.getResponse() as ExceptionResponse;

			if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
				errorResponse.message = exceptionResponse.message ?? 'An error occurred';
				errorResponse.error = exceptionResponse.error ?? 'Error';
			}
		}

		if (this.configService.config.NODE_ENV !== NodeEnv.test) {
			const errorFull: ExceptionResponseFull = {
				...errorResponse,
				method: request.method,
				path: request.url,
				timestamp: new Date().toISOString()
			};

			response.status(status).json(errorFull);

			return;
		}

		response.status(status).json(errorResponse);
	}
}
