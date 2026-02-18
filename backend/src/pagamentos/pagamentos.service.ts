import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Pagamento, PagamentoStatus, Prisma } from '@prisma/client';
import { CalcularMesDto } from './dto/calcular-mes.dto';
import { ConfirmarPagamentoDto } from './dto/confirmar-pagamento.dto';

const VALOR_HORA = 20; // R$ 20 por hora

@Injectable()
export class PagamentosService {
  constructor(private databaseService: DatabaseService) { }

  /**
   * Calcula e cria/atualiza pagamentos para um mês específico
   * Agregando horas de plantões aprovados
   */
  async calcularMes(calcularMesDto: CalcularMesDto): Promise<any> {
    const { mes, cuidadorId } = calcularMesDto;

    // Valida formato do mês
    const [ano, mesNum] = mes.split('-').map(Number);
    if (isNaN(ano) || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      throw new BadRequestException('Mês informado inválido');
    }

    // Define período do mês
    const dataInicio = new Date(`${mes}-01T00:00:00Z`);
    const dataFim = new Date(ano, mesNum, 1); // Primeiro dia do próximo mês

    // Busca plantões aprovados no período
    const plantoes = await this.databaseService.client.plantao.findMany({
      where: {
        status: 'APROVADO',
        dataInicio: {
          gte: dataInicio,
          lt: dataFim,
        },
        cuidadorId: cuidadorId || undefined,
      },
      include: {
        cuidador: true,
      },
    });

    if (plantoes.length === 0) {
      throw new BadRequestException(
        `Nenhum plantão aprovado encontrado para ${mes}`,
      );
    }

    // Agrupa por cuidador
    const pagamentosPorCuidador: {
      [cuidadorId: string]: {
        totalHoras: number;
        plantoes: typeof plantoes;
      };
    } = {};

    plantoes.forEach((plantao) => {
      const cuidId = plantao.cuidadorId;
      if (!cuidId) return; // Ignora plantões sem cuidador

      if (!pagamentosPorCuidador[cuidId]) {
        pagamentosPorCuidador[cuidId] = {
          totalHoras: 0,
          plantoes: [],
        };
      }
      pagamentosPorCuidador[cuidId].totalHoras += plantao.horasTrabalhadas;
      pagamentosPorCuidador[cuidId].plantoes.push(plantao);
    });

    // Cria ou atualiza pagamentos
    const pagamentosProcessados: any[] = [];

    for (const [cuidId, dados] of Object.entries(pagamentosPorCuidador)) {
      const valorTotal = new Prisma.Decimal(
        dados.totalHoras * VALOR_HORA,
      );

      // Verifica se pagamento já existe
      const pagamentoExistente = await this.databaseService.client.pagamento.findUnique(
        {
          where: {
            cuidadorId_mes: {
              cuidadorId: cuidId,
              mes,
            },
          },
        },
      );

      if (pagamentoExistente) {
        // Atualiza se já existe
        const pagamentoAtualizado =
          await this.databaseService.client.pagamento.update({
            where: { id: pagamentoExistente.id },
            data: {
              totalHoras: dados.totalHoras,
              valorTotal,
            },
            include: {
              cuidador: {
                include: {
                  user: true,
                },
              },
            },
          });
        pagamentosProcessados.push(pagamentoAtualizado);
      } else {
        // Cria novo pagamento
        const novoPagamento =
          await this.databaseService.client.pagamento.create({
            data: {
              cuidadorId: cuidId,
              mes,
              totalHoras: dados.totalHoras,
              valorTotal,
              status: PagamentoStatus.PENDENTE,
            },
            include: {
              cuidador: {
                include: {
                  user: true,
                },
              },
            },
          });
        pagamentosProcessados.push(novoPagamento);
      }
    }

    return {
      mes,
      totalPagamentos: pagamentosProcessados.length,
      totalValor: pagamentosProcessados.reduce(
        (sum, p) => sum + Number(p.valorTotal),
        0,
      ),
      pagamentos: pagamentosProcessados,
    };
  }

  /**
   * Lista pagamentos com filtros opcionais
   */
  async findAll(
    mes?: string,
    status?: PagamentoStatus,
    cuidadorId?: string,
  ): Promise<Pagamento[]> {
    return this.databaseService.client.pagamento.findMany({
      where: {
        mes: mes || undefined,
        status: status || undefined,
        cuidadorId: cuidadorId || undefined,
      },
      include: {
        cuidador: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  /**
   * Busca um pagamento específico
   */
  async findById(id: string): Promise<Pagamento> {
    const pagamento = await this.databaseService.client.pagamento.findUnique({
      where: { id },
      include: {
        cuidador: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  /**
   * Marca pagamento como processado (pronto para transferência)
   */
  async marcarComoProcessado(id: string): Promise<Pagamento> {
    const pagamento = await this.findById(id);

    if (
      pagamento.status !== PagamentoStatus.PENDENTE &&
      pagamento.status !== PagamentoStatus.PROCESSADO
    ) {
      throw new BadRequestException(
        'Apenas pagamentos PENDENTE podem ser processados',
      );
    }

    return this.databaseService.client.pagamento.update({
      where: { id },
      data: {
        status: PagamentoStatus.PROCESSADO,
      },
      include: {
        cuidador: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /**
   * Confirma pagamento com comprovante
   */
  async confirmarPagamento(
    id: string,
    confirmDto: ConfirmarPagamentoDto,
  ): Promise<Pagamento> {
    const pagamento = await this.findById(id);

    if (pagamento.status !== PagamentoStatus.PROCESSADO) {
      throw new BadRequestException(
        'Apenas pagamentos PROCESSADO podem ser confirmados',
      );
    }

    return this.databaseService.client.pagamento.update({
      where: { id },
      data: {
        status: PagamentoStatus.PAID,
        dataPagamento: confirmDto.dataPagamento
          ? new Date(confirmDto.dataPagamento)
          : new Date(),
        numeroComprovante: confirmDto.numeroComprovante,
        atualizadoEm: new Date(),
      },
      include: {
        cuidador: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /**
   * Gera relatório financeiro de um mês
   */
  async gerarRelatorio(mes: string): Promise<any> {
    const pagamentos = await this.findAll(mes);

    if (pagamentos.length === 0) {
      throw new NotFoundException(`Nenhum pagamento encontrado para ${mes}`);
    }

    const pagamentosComCuidador = pagamentos as any[];

    const resumo = {
      mes,
      totalCuidadores: new Set(pagamentos.map((p) => p.cuidadorId)).size,
      totalHoras: pagamentos.reduce((sum, p) => sum + p.totalHoras, 0),
      totalValor: pagamentos.reduce((sum, p) => sum + Number(p.valorTotal), 0),
      porStatus: {
        PENDENTE: 0,
        PROCESSADO: 0,
      },
      detalhes: pagamentosComCuidador.map((p) => ({
        cuidador: p.cuidador?.user?.nome ?? 'N/A',
        email: p.cuidador?.user?.email ?? 'N/A',
        totalHoras: p.totalHoras,
        valorTotal: Number(p.valorTotal),
        status: p.status,
        dataPagamento: p.dataPagamento,
        numeroComprovante: p.numeroComprovante,
      })),
    };

    // Conta por status
    pagamentos.forEach((p) => {
      if (p.status in resumo.porStatus) {
        resumo.porStatus[p.status as keyof typeof resumo.porStatus]++;
      }
    });

    return resumo;
  }

  /**
   * Deleta um pagamento (apenas se PENDENTE)
   */
  async delete(id: string): Promise<Pagamento> {
    const pagamento = await this.findById(id);

    if (pagamento.status !== PagamentoStatus.PENDENTE) {
      throw new BadRequestException(
        'Apenas pagamentos PENDENTE podem ser deletados',
      );
    }

    return this.databaseService.client.pagamento.delete({
      where: { id },
      include: {
        cuidador: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
