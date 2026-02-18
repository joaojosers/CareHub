import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PagamentosService } from './pagamentos.service';
import { CalcularMesDto } from './dto/calcular-mes.dto';
import { ConfirmarPagamentoDto } from './dto/confirmar-pagamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PagamentoStatus } from '@prisma/client';

@ApiTags('Pagamentos (Admin)')
@ApiBearerAuth()
@Controller('pagamentos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post('calcular-mes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calcular pagamentos do mês',
    description:
      'Calcula e cria/atualiza os pagamentos para um mês específico com base em plantões aprovados',
  })
  @ApiResponse({
    status: 200,
    description: 'Pagamentos calculados com sucesso',
    schema: {
      example: {
        mes: '2026-02',
        totalPagamentos: 3,
        totalValor: 1200,
        pagamentos: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Mês inválido ou sem plantões' })
  async calcularMes(@Body() calcularMesDto: CalcularMesDto) {
    return this.pagamentosService.calcularMes(calcularMesDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar pagamentos',
    description: 'Lista pagamentos com filtros opcionais por mês, status e cuidador',
  })
  @ApiQuery({ name: 'mes', required: false, example: '2026-02' })
  @ApiQuery({
    name: 'status',
    enum: PagamentoStatus,
    required: false,
  })
  @ApiQuery({ name: 'cuidadorId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos retornada',
  })
  async findAll(
    @Query('mes') mes?: string,
    @Query('status') status?: PagamentoStatus,
    @Query('cuidadorId') cuidadorId?: string,
  ) {
    return this.pagamentosService.findAll(mes, status, cuidadorId);
  }

  @Get('relatorio/:mes')
  @ApiOperation({
    summary: 'Gerar relatório financeiro',
    description: 'Gera um relatório detalhado de pagamentos para um mês',
  })
  @ApiParam({ name: 'mes', description: 'Mês (YYYY-MM)', example: '2026-02' })
  @ApiResponse({
    status: 200,
    description: 'Relatório gerado com sucesso',
    schema: {
      example: {
        mes: '2026-02',
        totalCuidadores: 3,
        totalHoras: 60,
        totalValor: 1200,
        porStatus: { PENDENTE: 2, PROCESSADO: 1, PAID: 0 },
        detalhes: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Nenhum pagamento encontrado' })
  async gerarRelatorio(@Param('mes') mes: string) {
    return this.pagamentosService.gerarRelatorio(mes);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes do pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento retornado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async findById(@Param('id') id: string) {
    return this.pagamentosService.findById(id);
  }

  @Patch(':id/processar')
  @ApiOperation({
    summary: 'Marcar pagamento como processado',
    description: 'Marca um pagamento PENDENTE como PROCESSADO (pronto para transferência)',
  })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento marcado como processado' })
  @ApiResponse({
    status: 400,
    description: 'Pagamento já foi processado ou confirmado',
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async marcarComoProcessado(@Param('id') id: string) {
    return this.pagamentosService.marcarComoProcessado(id);
  }

  @Patch(':id/confirmar-pagamento')
  @ApiOperation({
    summary: 'Confirmar pagamento',
    description: 'Marca um pagamento PROCESSADO como PAID com comprovante',
  })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento confirmado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Pagamento não está em status PROCESSADO',
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async confirmarPagamento(
    @Param('id') id: string,
    @Body() confirmDto: ConfirmarPagamentoDto,
  ) {
    return this.pagamentosService.confirmarPagamento(id, confirmDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar pagamento',
    description: 'Deleta um pagamento (apenas se PENDENTE)',
  })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento deletado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Apenas pagamentos PENDENTE podem ser deletados',
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async delete(@Param('id') id: string) {
    return this.pagamentosService.delete(id);
  }
}
