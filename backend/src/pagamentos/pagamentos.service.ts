import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PagamentoStatus, MetodoPagamento, Prisma } from '@prisma/client';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { ConfirmarPagamentoDto } from './dto/confirmar-pagamento.dto';

const TAXA_PLATAFORMA = 0.10; // 10% platform fee

@Injectable()
export class PagamentosService {
  constructor(private databaseService: DatabaseService) { }

  /**
   * Creates a payment for a specific approved shift
   * valorBruto = horasTrabalhadas × valorHora
   * taxaPlataforma = valorBruto × 10%
   * valorLiquido = valorBruto - taxaPlataforma
   */
  async create(dto: CreatePagamentoDto): Promise<any> {
    const { plantaoId, metodoPagamento } = dto;

    // 1. Fetch the shift with caregiver details
    const plantao = await this.databaseService.client.plantao.findUnique({
      where: { id: plantaoId },
      include: {
        cuidador: true,
      },
    });

    if (!plantao) {
      throw new NotFoundException(`Plantão ${plantaoId} não encontrado`);
    }

    // 2. Only APROVADO shifts can be paid
    if (plantao.status !== 'APROVADO') {
      throw new BadRequestException(
        `Apenas plantões APROVADO podem ser pagos. Status atual: ${plantao.status}`,
      );
    }

    // 3. Must have an assigned caregiver
    if (!plantao.cuidadorId || !plantao.cuidador) {
      throw new BadRequestException(
        'Plantão não possui cuidador atribuído',
      );
    }

    // 4. Check if payment already exists for this shift
    const existing = await this.databaseService.client.pagamento.findUnique({
      where: { plantaoId },
    });

    if (existing) {
      throw new ConflictException(
        `Já existe um pagamento para o plantão ${plantaoId}`,
      );
    }

    // 5. Calculate values
    const valorHora = plantao.cuidador.valorHora ?? new Prisma.Decimal(20);
    const valorBruto = new Prisma.Decimal(plantao.horasTrabalhadas).mul(valorHora);
    const taxaPlataforma = valorBruto.mul(new Prisma.Decimal(TAXA_PLATAFORMA));
    const valorLiquido = valorBruto.sub(taxaPlataforma);

    // 6. Create payment
    return this.databaseService.client.pagamento.create({
      data: {
        plantaoId,
        cuidadorId: plantao.cuidadorId,
        valorBruto,
        valorLiquido,
        taxaPlataforma,
        status: PagamentoStatus.PENDENTE,
        metodoPagamento: metodoPagamento ?? MetodoPagamento.PIX,
      },
      include: {
        plantao: {
          include: { paciente: true },
        },
        cuidador: {
          include: { user: true },
        },
      },
    });
  }

  /**
   * List all payments (Admin) with optional filters
   */
  async findAll(
    mes?: string,
    status?: PagamentoStatus,
    cuidadorId?: string,
  ): Promise<any[]> {
    // Build date filter from mes (YYYY-MM)
    let dateFilter: { gte?: Date; lt?: Date } | undefined;
    if (mes) {
      const [ano, mesNum] = mes.split('-').map(Number);
      dateFilter = {
        gte: new Date(`${mes}-01T00:00:00Z`),
        lt: new Date(ano, mesNum, 1),
      };
    }

    return this.databaseService.client.pagamento.findMany({
      where: {
        status: status || undefined,
        cuidadorId: cuidadorId || undefined,
        ...(dateFilter && {
          plantao: {
            dataInicio: dateFilter,
          },
        }),
      },
      include: {
        plantao: {
          include: { paciente: true },
        },
        cuidador: {
          include: { user: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * List payments for the authenticated caregiver (Cuidador view)
   */
  async findMy(cuidadorId: string): Promise<any[]> {
    return this.databaseService.client.pagamento.findMany({
      where: { cuidadorId },
      include: {
        plantao: {
          include: { paciente: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Get a single payment by ID
   */
  async findById(id: string): Promise<any> {
    const pagamento = await this.databaseService.client.pagamento.findUnique({
      where: { id },
      include: {
        plantao: {
          include: { paciente: true },
        },
        cuidador: {
          include: { user: true },
        },
      },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  /**
   * Mark payment as PROCESSADO (ready for bank transfer)
   * Transition: PENDENTE → PROCESSADO
   */
  async marcarComoProcessado(id: string): Promise<any> {
    const pagamento = await this.findById(id);

    if (pagamento.status !== PagamentoStatus.PENDENTE) {
      throw new BadRequestException(
        `Apenas pagamentos PENDENTE podem ser processados. Status atual: ${pagamento.status}`,
      );
    }

    return this.databaseService.client.pagamento.update({
      where: { id },
      data: { status: PagamentoStatus.PROCESSADO },
      include: {
        plantao: { include: { paciente: true } },
        cuidador: { include: { user: true } },
      },
    });
  }

  /**
   * Confirm payment with proof (receipt)
   * Transition: PROCESSADO → PAID
   */
  async confirmarPagamento(
    id: string,
    dto: ConfirmarPagamentoDto,
  ): Promise<any> {
    const pagamento = await this.findById(id);

    if (pagamento.status !== PagamentoStatus.PROCESSADO) {
      throw new BadRequestException(
        `Apenas pagamentos PROCESSADO podem ser confirmados. Status atual: ${pagamento.status}`,
      );
    }

    return this.databaseService.client.pagamento.update({
      where: { id },
      data: {
        status: PagamentoStatus.PAID,
        dataPagamento: dto.dataPagamento
          ? new Date(dto.dataPagamento)
          : new Date(),
        numeroComprovante: dto.numeroComprovante,
        atualizadoEm: new Date(),
      },
      include: {
        plantao: { include: { paciente: true } },
        cuidador: { include: { user: true } },
      },
    });
  }

  /**
   * Monthly financial summary report
   */
  async gerarRelatorio(mes: string): Promise<any> {
    const [ano, mesNum] = mes.split('-').map(Number);
    if (isNaN(ano) || isNaN(mesNum)) {
      throw new BadRequestException('Mês inválido. Use formato YYYY-MM');
    }

    const pagamentos = await this.databaseService.client.pagamento.findMany({
      where: {
        plantao: {
          dataInicio: {
            gte: new Date(`${mes}-01T00:00:00Z`),
            lt: new Date(ano, mesNum, 1),
          },
        },
      },
      include: {
        plantao: true,
        cuidador: { include: { user: true } },
      },
    });

    if (pagamentos.length === 0) {
      throw new NotFoundException(`Nenhum pagamento encontrado para ${mes}`);
    }

    const pagamentosTyped = pagamentos as any[];

    const resumo = {
      mes,
      totalPagamentos: pagamentos.length,
      totalCuidadores: new Set(pagamentos.map((p) => p.cuidadorId)).size,
      totalHoras: pagamentosTyped.reduce(
        (sum, p) => sum + (p.plantao?.horasTrabalhadas ?? 0),
        0,
      ),
      totalBruto: pagamentos.reduce(
        (sum, p) => sum + Number(p.valorBruto),
        0,
      ),
      totalLiquido: pagamentos.reduce(
        (sum, p) => sum + Number(p.valorLiquido),
        0,
      ),
      totalTaxaPlataforma: pagamentos.reduce(
        (sum, p) => sum + Number(p.taxaPlataforma),
        0,
      ),
      porStatus: {
        PENDENTE: pagamentos.filter((p) => p.status === 'PENDENTE').length,
        PROCESSADO: pagamentos.filter((p) => p.status === 'PROCESSADO').length,
        PAID: pagamentos.filter((p) => p.status === 'PAID').length,
      },
      detalhes: pagamentosTyped.map((p) => ({
        cuidador: p.cuidador?.user?.nome ?? 'N/A',
        email: p.cuidador?.user?.email ?? 'N/A',
        plantaoId: p.plantaoId,
        horasTrabalhadas: p.plantao?.horasTrabalhadas ?? 0,
        valorBruto: Number(p.valorBruto),
        taxaPlataforma: Number(p.taxaPlataforma),
        valorLiquido: Number(p.valorLiquido),
        metodoPagamento: p.metodoPagamento,
        status: p.status,
        dataPagamento: p.dataPagamento,
        numeroComprovante: p.numeroComprovante,
      })),
    };

    return resumo;
  }

  /**
   * Delete a payment (only PENDENTE)
   */
  async delete(id: string): Promise<any> {
    const pagamento = await this.findById(id);

    if (pagamento.status !== PagamentoStatus.PENDENTE) {
      throw new BadRequestException(
        'Apenas pagamentos PENDENTE podem ser deletados',
      );
    }

    return this.databaseService.client.pagamento.delete({
      where: { id },
    });
  }
}
