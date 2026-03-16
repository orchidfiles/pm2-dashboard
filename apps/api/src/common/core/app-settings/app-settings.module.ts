import { Global, Module } from '@nestjs/common';

import { AppSettingsService } from './app-settings.service';

export { AppSettingsService };

@Global()
@Module({
	providers: [AppSettingsService],
	exports: [AppSettingsService]
})
export class AppSettingsModule {}
