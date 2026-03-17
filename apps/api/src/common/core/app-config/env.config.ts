import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { NodeEnv } from 'enums';

export class EnvVariables {
	@IsEnum(NodeEnv)
	@IsOptional()
	NODE_ENV: NodeEnv = NodeEnv.development;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsOptional()
	API_PORT = 3100;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@Max(65535)
	@IsOptional()
	WEB_PORT = 3101;

	@IsString()
	@IsOptional()
	APP_HOST = '127.0.0.1';

	@IsString()
	@IsOptional()
	DB_PATH = '';
}
