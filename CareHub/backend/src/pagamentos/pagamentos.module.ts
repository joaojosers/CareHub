import { Module } from '@nestjs/common';
import { PagamentosController } from './pagamentos.controller';
import { PagamentosService } from './pagamentos.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PagamentosController],
  providers: [PagamentosService],
  exports: [PagamentosService], // permite usar o serviço em outros módulos
})
export class PagamentosModule {}


