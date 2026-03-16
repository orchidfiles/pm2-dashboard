import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import session from 'express-session';

import { AllExceptionsFilter } from 'common/filters/all-exception.filter';
import { CustomSerializerInterceptor } from 'common/interceptors/custom-serializer.interceptor';
import { NullFieldsInterceptor } from 'common/interceptors/null-fields.interceptor';
import { AppConfigService } from 'core/app-config/app-config.service';
import { NodeEnv } from 'enums';
import { SqliteSessionStore } from 'src/database';

export class AppBootstrap {
	static configureSession(app: INestApplication, configService: AppConfigService, store: SqliteSessionStore, secret: string) {
		const isProduction = configService.config.NODE_ENV === NodeEnv.production;

		app.use(
			session({
				secret,
				store,
				resave: false,
				saveUninitialized: false,
				cookie: {
					httpOnly: true,
					secure: isProduction,
					maxAge: configService.sessionMaxAgeMs
				}
			})
		);
	}

	static configureApp(app: INestApplication, configService: AppConfigService) {
		const reflector = app.get(Reflector);

		app.setGlobalPrefix('api');
		app.useGlobalFilters(new AllExceptionsFilter(configService));
		app.useGlobalInterceptors(new CustomSerializerInterceptor(reflector));
		app.useGlobalInterceptors(new NullFieldsInterceptor());
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true
			})
		);
	}
}
