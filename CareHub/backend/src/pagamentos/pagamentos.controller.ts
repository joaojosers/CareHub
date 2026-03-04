import { Controller, Get, Post, Param, Body, Patch, BadRequestException } from '@nestjs/common';
import { PagamentosService, StatusPagamento } from './pagamentos.service';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post(':cuidadorId')
  async gerarPix(
    @Param('cuidadorId') cuidadorId: string,
    @Body('valor') valor: number,
  ) {
    if (!cuidadorId || cuidadorId.trim() === '') {
      throw new BadRequestException('ID incorreto ou inválido.');
    }
    return this.pagamentosService.gerarPix(cuidadorId, valor);
  }

  @Get(':id')
  async buscarPagamentoPorId(@Param('id') id: string) {
    const numeroId = Number(id);
    if (isNaN(numeroId) || numeroId <= 0) {
      throw new BadRequestException('ID incorreto ou inválido.');
    }
    return this.pagamentosService.buscarPagamentoPorId(numeroId);
  }

  @Patch(':id/status')
  async atualizarStatus(
    @Param('id') id: string,
    @Body('status') status: StatusPagamento,
  ) {
    const numeroId = Number(id);
    if (isNaN(numeroId) || numeroId <= 0) {
      throw new BadRequestException('ID incorreto ou inválido.');
    }
    return this.pagamentosService.atualizarStatus(numeroId, status);
  }
}
