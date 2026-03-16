import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { AppSettingsService } from 'core/app-settings/app-settings.module';

@Injectable()
export class SetupGuard implements CanActivate {
	constructor(@Inject(AppSettingsService) private readonly appSettings: AppSettingsService) {}

	canActivate(_context: ExecutionContext): boolean {
		if (this.appSettings.isSetupCompleted()) {
			throw new ForbiddenException();
		}

		return true;
	}
}
