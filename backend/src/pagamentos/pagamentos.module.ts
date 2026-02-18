import { Module } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PagamentosController],
  providers: [PagamentosService],
  exports: [PagamentosService],
})
export class PagamentosModule {}
