import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';

import { ProcessesService } from './processes.service';

import type { ProcessAction } from '@pm2-dashboard/shared';

const ALLOWED_ACTIONS: ProcessAction[] = ['start', 'stop', 'restart'];

interface BulkActionBody {
	action: ProcessAction;
	ids: number[];
}

interface BulkError {
	id: number;
	error: string;
}

@Controller('processes')
export class ProcessesController {
	constructor(private readonly processesService: ProcessesService) {}

	@Get()
	async list() {
		return this.processesService.list();
	}

	@Post(':id/:action')
	@HttpCode(200)
	async runAction(@Param('id') id: string, @Param('action') action: string) {
		if (!ALLOWED_ACTIONS.includes(action as ProcessAction)) {
			throw new BadRequestException(`Unknown action: ${action}`);
		}

		await this.processesService.runAction(action as ProcessAction, Number(id));

		const result = { ok: true };

		return result;
	}

	@Post('bulk')
	@HttpCode(200)
	async bulkAction(@Body() body: BulkActionBody) {
		const { action, ids } = body;

		if (!ALLOWED_ACTIONS.includes(action)) {
			throw new BadRequestException(`Unknown action: ${action}`);
		}

		if (!Array.isArray(ids) || ids.length === 0) {
			throw new BadRequestException('ids must be a non-empty array');
		}

		const results = await Promise.allSettled(ids.map((id) => this.processesService.runAction(action, id)));

		const errors: BulkError[] = results
			.map((r, i) => {
				if (r.status === 'rejected') {
					const message = r.reason instanceof Error ? r.reason.message : 'Unknown error';

					const bulkError: BulkError = { id: ids[i], error: message };

					return bulkError;
				}

				return null;
			})
			.filter((r): r is BulkError => r !== null);

		if (errors.length > 0) {
			throw new HttpException({ ok: false, errors }, HttpStatus.MULTI_STATUS);
		}

		const result = { ok: true };

		return result;
	}
}
