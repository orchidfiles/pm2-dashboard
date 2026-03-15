import 'reflect-metadata';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Infra } from '@pm2-dashboard/shared';

import { AllExceptionsFilter } from 'common/filters/all-exception.filter';
import { CustomSerializerInterceptor } from 'common/interceptors/custom-serializer.interceptor';
import { NullFieldsInterceptor } from 'common/interceptors/null-fields.interceptor';
import { AppConfigService } from 'core/app-config/app-config.service';

import { AppModule } from './app.module';

Infra.loadEnv();

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get<AppConfigService>(AppConfigService);
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

	const port = configService.config.API_PORT;
	const host = configService.config.APP_HOST;

	await app.listen(port, host);

	console.log(`pm2-dashboard api listening on http://${host}:${port}`);
}

bootstrap().catch((err) => {
	console.error(err);
	process.exit(1);
});
