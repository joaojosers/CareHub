import { Controller, Post, Param } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';


@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post(':cuidadorId')
  async pagar(@Param('cuidadorId') cuidadorId: string) {
    return this.pagamentosService.gerarPix(cuidadorId);
  }
}
