import { Module } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { PagamentosController } from './pagamentos.controller';
import { DatabaseModule } from '../database/database.module';
import { MercadoPagoModule } from '../mercado-pago/mercado-pago.module';

@Module({
  imports: [DatabaseModule, MercadoPagoModule],
  controllers: [PagamentosController],
  providers: [PagamentosService],
  exports: [PagamentosService],
})
export class PagamentosModule { }
