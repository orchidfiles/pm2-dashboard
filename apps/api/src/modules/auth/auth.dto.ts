import { IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsString()
	username: string;

	@IsString()
	@MinLength(8)
	password: string;
}

export class SetupDto {
	@IsString()
	@MinLength(1)
	username: string;

	@IsString()
	@MinLength(6)
	password: string;
}
