import { Module } from '@nestjs/common';
import { PlantoesService } from './plantoes.service';
import { PlantoesController } from './plantoes.controller';
import { DatabaseModule } from '../database/database.module';
import { PagamentosModule } from 'src/pagamentos/pagamentos.module';

@Module({
  imports: [DatabaseModule, PagamentosModule],
  providers: [PlantoesService],
  controllers: [PlantoesController]
})
export class PlantoesModule { }

