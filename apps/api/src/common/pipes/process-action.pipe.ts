import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEnum } from 'class-validator';

import { ProcessAction } from '@pm2-dashboard/shared';

@Injectable()
export class ProcessActionPipe implements PipeTransform<string, ProcessAction> {
	transform(value: string): ProcessAction {
		if (!isEnum(value, ProcessAction)) {
			throw new BadRequestException(`Unknown action: ${value}`);
		}

		return value as ProcessAction;
	}
}
