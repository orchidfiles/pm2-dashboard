import { Global, Module } from '@nestjs/common';

import { AppConfigService } from './app-config.service';

export { AppConfigService };

@Global()
@Module({
	providers: [AppConfigService],
	exports: [AppConfigService]
})
export class AppConfigModule {}
