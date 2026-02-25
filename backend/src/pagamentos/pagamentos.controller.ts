import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { PagamentosService, StatusPagamento } from './pagamentos.service';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  // Gera um QR Code Pix para um cuidador específico
  @Post(':cuidadorId')
  async gerarPix(
    @Param('cuidadorId') cuidadorId: string,
    @Body('valor') valor: number,
  ) {
    return this.pagamentosService.gerarPix(cuidadorId, valor);
  }

  // Lista todos os pagamentos
  @Get()
  async listarPagamentos() {
    return this.pagamentosService.listarPagamentos();
  }

  // Busca pagamento por ID
  @Get(':id')
  async buscarPagamentoPorId(@Param('id') id: number) {
    return this.pagamentosService.buscarPagamentoPorId(id);
  }

  // Atualiza status de um pagamento
  @Patch(':id/status')
  async atualizarStatus(
    @Param('id') id: number,
    @Body('status') status: StatusPagamento,
  ) {
    return this.pagamentosService.atualizarStatus(id, status);
  }
}
