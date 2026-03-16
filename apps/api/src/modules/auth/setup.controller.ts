import { BadRequestException, Body, Controller, Get, HttpCode, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';

import { UuidPipe } from 'common/pipes';
import { AppSettingsService } from 'core/app-settings/app-settings.module';

import { SetupDto } from './auth.dto';
import { AuthService } from './auth.service';
import { SetupGuard } from './setup.guard';

import type { ActionResult, CheckTokenResult } from '@pm2-dashboard/shared';
import type { Request } from 'express';

@UseGuards(SetupGuard)
@Controller('setup')
export class SetupController {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(AppSettingsService) private readonly appSettings: AppSettingsService
	) {}

	@Get()
	checkToken(@Query('token', UuidPipe) token: string): CheckTokenResult {
		const valid = this.appSettings.isValidSetupToken(token);

		const result: CheckTokenResult = { valid };

		return result;
	}

	@Post()
	@HttpCode(200)
	async completeSetup(
		@Body() body: SetupDto,
		@Query('token', UuidPipe) token: string,
		@Req() req: Request
	): Promise<ActionResult> {
		if (!this.appSettings.isValidSetupToken(token)) {
			throw new BadRequestException('Invalid setup token');
		}

		const userId = await this.authService.completeSetup(body.username, body.password);

		req.session.userId = userId;

		const result: ActionResult = {};

		return result;
	}
}
