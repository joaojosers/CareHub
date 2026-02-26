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
  Request,
  Headers,
  HttpCode,
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
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { ConfirmarPagamentoDto } from './dto/confirmar-pagamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PagamentoStatus, MetodoPagamento } from '@prisma/client';

@ApiTags('Pagamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) { }

  // ─── ADMIN ENDPOINTS ───────────────────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Criar pagamento para um plantão (Admin)',
    description:
      'Cria um pagamento para um plantão APROVADO. Calcula automaticamente valorBruto, taxaPlataforma (10%) e valorLiquido.',
  })
  @ApiResponse({
    status: 201,
    description: 'Pagamento criado com sucesso',
    schema: {
      example: {
        id: 'uuid',
        plantaoId: 'uuid-plantao',
        cuidadorId: 'uuid-cuidador',
        valorBruto: 160.0,
        taxaPlataforma: 16.0,
        valorLiquido: 144.0,
        status: 'PENDENTE',
        metodoPagamento: 'PIX',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Plantão não aprovado ou sem cuidador' })
  @ApiResponse({ status: 404, description: 'Plantão não encontrado' })
  @ApiResponse({ status: 409, description: 'Pagamento já existe para este plantão' })
  async create(@Body() dto: CreatePagamentoDto) {
    return this.pagamentosService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Listar todos os pagamentos (Admin)',
    description: 'Lista pagamentos com filtros opcionais por mês, status e cuidador',
  })
  @ApiQuery({ name: 'mes', required: false, example: '2026-02', description: 'Mês (YYYY-MM)' })
  @ApiQuery({ name: 'status', enum: PagamentoStatus, required: false })
  @ApiQuery({ name: 'cuidadorId', required: false })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos retornada' })
  async findAll(
    @Query('mes') mes?: string,
    @Query('status') status?: PagamentoStatus,
    @Query('cuidadorId') cuidadorId?: string,
  ) {
    return this.pagamentosService.findAll(mes, status, cuidadorId);
  }

  @Get('relatorio/:mes')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Relatório financeiro mensal (Admin)',
    description: 'Gera relatório com totais bruto/líquido, taxa da plataforma e breakdown por cuidador',
  })
  @ApiParam({ name: 'mes', description: 'Mês (YYYY-MM)', example: '2026-02' })
  @ApiResponse({
    status: 200,
    description: 'Relatório gerado com sucesso',
    schema: {
      example: {
        mes: '2026-02',
        totalPagamentos: 3,
        totalCuidadores: 2,
        totalHoras: 24,
        totalBruto: 480.0,
        totalLiquido: 432.0,
        totalTaxaPlataforma: 48.0,
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Detalhes de um pagamento (Admin)' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento retornado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async findById(@Param('id') id: string) {
    return this.pagamentosService.findById(id);
  }

  @Patch(':id/processar')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Processar pagamento (Admin)',
    description: 'Transição PENDENTE → PROCESSADO. Indica que o pagamento está pronto para transferência.',
  })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento marcado como PROCESSADO' })
  @ApiResponse({ status: 400, description: 'Pagamento não está em status PENDENTE' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async marcarComoProcessado(@Param('id') id: string) {
    return this.pagamentosService.marcarComoProcessado(id);
  }

  @Patch(':id/confirmar-pagamento')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Confirmar pagamento com comprovante (Admin)',
    description: 'Transição PROCESSADO → PAID. Registra comprovante e data do pagamento.',
  })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento confirmado como PAID' })
  @ApiResponse({ status: 400, description: 'Pagamento não está em status PROCESSADO' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async confirmarPagamento(
    @Param('id') id: string,
    @Body() dto: ConfirmarPagamentoDto,
  ) {
    return this.pagamentosService.confirmarPagamento(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Deletar pagamento (Admin)',
    description: 'Remove um pagamento. Apenas pagamentos PENDENTE podem ser deletados.',
  })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento deletado' })
  @ApiResponse({ status: 400, description: 'Apenas PENDENTE podem ser deletados' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async delete(@Param('id') id: string) {
    return this.pagamentosService.delete(id);
  }

  // ─── MERCADO PAGO WEBHOOK ──────────────────────────────────────────────────

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Webhook Mercado Pago (público)',
    description:
      'Recebe notificações automáticas do Mercado Pago quando um pagamento Pix é confirmado. ' +
      'Não requer autenticação JWT — a segurança é garantida pela validação de assinatura (x-signature).',
  })
  @ApiResponse({ status: 200, description: 'Notificação recebida e processada' })
  async webhookMercadoPago(
    @Headers('x-signature') xSignature: string,
    @Headers('x-request-id') xRequestId: string,
    @Query('data.id') dataId: string,
    @Body() body: any,
  ) {
    return this.pagamentosService.processarWebhookMP(
      xSignature || '',
      xRequestId || '',
      dataId || '',
      body,
    );
  }

  // ─── CUIDADOR ENDPOINTS ────────────────────────────────────────────────────

  @Get('meus-pagamentos')
  @Roles(UserRole.CUIDADOR)
  @ApiOperation({
    summary: 'Meus pagamentos (Cuidador)',
    description: 'Lista os pagamentos do cuidador autenticado, com detalhes do plantão e paciente.',
  })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos do cuidador' })
  async findMy(@Request() req: any) {
    const cuidadorId = req.user.cuidadorId;
    return this.pagamentosService.findMy(cuidadorId);
  }
}
