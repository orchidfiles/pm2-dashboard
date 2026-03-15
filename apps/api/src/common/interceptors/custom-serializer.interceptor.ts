import { Injectable, ExecutionContext } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer/class-serializer.interceptor.js';
import { Reflector } from '@nestjs/core';
import { ClassTransformOptions } from 'class-transformer';

@Injectable()
export class CustomSerializerInterceptor extends ClassSerializerInterceptor {
	constructor(protected readonly reflector: Reflector) {
		super(reflector);
	}

	protected getOptions(context: ExecutionContext): ClassTransformOptions {
		const serializeOptions = this.reflector.get<ClassTransformOptions>('serialize:options', context.getHandler());

		return {
			groups: serializeOptions?.groups ?? [],
			excludeExtraneousValues: true,
			enableCircularCheck: true
		};
	}
}
