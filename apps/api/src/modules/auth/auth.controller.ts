import { Body, Controller, Get, HttpCode, Inject, Post, Req, UseGuards } from '@nestjs/common';

import { SessionGuard } from 'common/guards/session.guard';

import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';

import type { ActionResult } from '@pm2-dashboard/shared';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(200)
	async login(@Body() body: LoginDto, @Req() req: Request): Promise<ActionResult> {
		const userId = await this.authService.login(body.username, body.password);

		req.session.userId = userId;

		const result: ActionResult = {};

		return result;
	}

	@Post('logout')
	@HttpCode(200)
	@UseGuards(SessionGuard)
	async logout(@Req() req: Request): Promise<ActionResult> {
		await this.authService.logout(req.session);

		const result: ActionResult = {};

		return result;
	}

	@Get('me')
	@UseGuards(SessionGuard)
	getMe(@CurrentUser() userId: number) {
		return this.authService.getUser(userId);
	}
}
