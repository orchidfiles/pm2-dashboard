import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NullFieldsInterceptor implements NestInterceptor {
	intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(map((data) => this.removeNullFields(data)));
	}

	private removeNullFields(obj: unknown): unknown {
		if (obj instanceof Date) {
			return obj;
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => this.removeNullFields(item));
		}

		if (typeof obj === 'object' && obj !== null) {
			const result: Record<string, unknown> = {};

			for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
				if (value !== null && value !== undefined) {
					result[key] = this.removeNullFields(value);
				}
			}

			return result;
		}

		return obj;
	}
}
