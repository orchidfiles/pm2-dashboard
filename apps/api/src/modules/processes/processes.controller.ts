import { Controller, Get, HttpCode, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { type ActionResult, type Process, type ProcessAction } from '@pm2-dashboard/shared';
import { SessionGuard } from 'common/guards/session.guard';
import { ProcessActionPipe } from 'common/pipes';

import { ProcessesService } from './processes.service';

@UseGuards(SessionGuard)
@Controller('processes')
export class ProcessesController {
	constructor(@Inject(ProcessesService) private readonly processesService: ProcessesService) {}

	@Get()
	async list(): Promise<Process[]> {
		return this.processesService.list();
	}

	@Post('bulk/:action')
	@HttpCode(200)
	async bulkAction(@Param('action', ProcessActionPipe) action: ProcessAction): Promise<ActionResult> {
		await this.processesService.runAll(action);

		return {};
	}

	// must be below bulk/:action — NestJS matches routes in declaration order
	@Post(':id/:action')
	@HttpCode(200)
	async runAction(
		@Param('id', ParseIntPipe) id: number,
		@Param('action', ProcessActionPipe) action: ProcessAction
	): Promise<ActionResult> {
		await this.processesService.runAction(action, id);

		return {};
	}
}
