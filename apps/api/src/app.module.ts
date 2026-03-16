import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { ClientInfoMiddleware } from 'common/middlewares/client-info.middleware';
import { AppConfigModule } from 'core/app-config/app-config.module';
import { AppDatabaseModule } from 'core/app-database/app-database.module';
import { AppSettingsModule } from 'core/app-settings/app-settings.module';
import { AuthModule } from 'modules/auth/auth.module';
import { LogsModule } from 'modules/logs/logs.module';
import { MetricsModule } from 'modules/metrics/metrics.module';
import { ProcessesModule } from 'modules/processes/processes.module';
import { WebsocketModule } from 'modules/websocket/websocket.module';

@Module({
	imports: [
		AppConfigModule,
		AppDatabaseModule,
		AppSettingsModule,
		ProcessesModule,
		AuthModule,
		LogsModule,
		MetricsModule,
		WebsocketModule
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ClientInfoMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL });
	}
}
