import { Module } from '@nestjs/common';

import { SqliteSessionStore } from 'src/database/sqlite-session.store';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SetupController } from './setup.controller';
import { SetupGuard } from './setup.guard';

@Module({
	controllers: [AuthController, SetupController],
	providers: [AuthService, SetupGuard, SqliteSessionStore],
	exports: [AuthService, SqliteSessionStore]
})
export class AuthModule {}
