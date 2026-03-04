import { Module } from '@nestjs/common';
import { PlantoesService } from './plantoes.service';
import { PlantoesController } from './plantoes.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PlantoesService],
  controllers: [PlantoesController]
})
export class PlantoesModule { }
