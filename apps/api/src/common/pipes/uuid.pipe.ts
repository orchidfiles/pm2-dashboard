import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UuidPipe implements PipeTransform<string, string> {
	transform(value: string): string {
		if (!isUUID(value, '4')) {
			throw new BadRequestException('Invalid UUID format');
		}

		return value;
	}
}
