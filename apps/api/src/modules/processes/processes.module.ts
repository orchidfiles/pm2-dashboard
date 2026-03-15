import { Module } from '@nestjs/common';

import { ProcessesController } from './processes.controller';
import { ProcessesService } from './processes.service';

@Module({
	controllers: [ProcessesController],
	providers: [ProcessesService]
})
export class ProcessesModule {}
