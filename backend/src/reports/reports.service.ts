import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: DatabaseService) { }

  async getAdminStats() {
    const [totalCuidadores, totalPacientes, totalPlantoes] = await Promise.all([
      this.prisma.client.user.count({ where: { tipo: 'CUIDADOR', status: 'APROVADO' } }),
      this.prisma.client.paciente.count({ where: { status: 'ATIVO' } }),
      this.prisma.client.plantao.count({ where: { status: 'APROVADO' } }),
    ]);

    const pagamentos = await this.prisma.client.pagamento.findMany();

    const totalRevenue = pagamentos.reduce((acc, p) => acc + Number(p.taxaPlataforma), 0);
    const totalProcessado = pagamentos.reduce((acc, p) => acc + Number(p.valorBruto), 0);

    const horasTrabalhadas = await this.prisma.client.plantao.aggregate({
      where: { status: 'APROVADO' },
      _sum: { horasTrabalhadas: true },
    });

    return {
      totalCuidadores,
      totalPacientes,
      totalPlantoes,
      horasTrabalhadas: horasTrabalhadas._sum.horasTrabalhadas || 0,
      totalRevenue,
      totalProcessado,
    };
  }

  async getCaregiverReport(cuidadorId: string) {
    const pagamentos = await this.prisma.client.pagamento.findMany({
      where: { cuidadorId },
    });

    const plantoes = await this.prisma.client.plantao.findMany({
      where: { cuidadorId, status: 'APROVADO' },
      include: { paciente: true },
    });

    const totalEarned = pagamentos.reduce((acc, p) => acc + Number(p.valorLiquido), 0);
    const totalHours = plantoes.reduce((acc, p) => acc + p.horasTrabalhadas, 0);

    // Group by patient
    const byPatient = plantoes.reduce((acc, p) => {
      const patientId = p.pacienteId;
      if (!acc[patientId]) {
        acc[patientId] = {
          nome: p.paciente.nome,
          horas: 0,
          plantoes: 0,
        };
      }
      acc[patientId].horas += p.horasTrabalhadas;
      acc[patientId].plantoes += 1;
      return acc;
    }, {} as Record<string, { nome: string; horas: number; plantoes: number }>);

    return {
      totalEarned,
      totalHours,
      averageHoursPerShift: plantoes.length > 0 ? totalHours / plantoes.length : 0,
      breakdownByPatient: Object.values(byPatient),
    };
  }

  async getFamilyReport(userId: string) {
    // Find patients linked to this family member
    const vinculos = await this.prisma.client.familiarVinculo.findMany({
      where: { userId },
      include: {
        paciente: {
          include: {
            plantoes: {
              where: { status: 'APROVADO' },
              include: {
                cuidador: {
                  include: { user: true }
                },
                relatorioAtividade: true
              }
            }
          }
        }
      }
    });

    return vinculos.map(v => {
      const plantoes = v.paciente.plantoes;
      const totalHours = plantoes.reduce((acc, p) => acc + p.horasTrabalhadas, 0);

      const cuidadoresUnicos = Array.from(new Set(plantoes.map(p => p.cuidador?.user.nome))).filter(Boolean);

      return {
        paciente: v.paciente.nome,
        totalHours,
        totalPlantoes: plantoes.length,
        cuidadores: cuidadoresUnicos,
        plantoes: plantoes.map(p => ({
          dataInicio: p.dataInicio,
          dataFim: p.dataFim,
          horas: p.horasTrabalhadas,
          cuidador: p.cuidador?.user.nome,
          relatorio: p.relatorioAtividade?.descricao || p.relatorioLegacy, // Tenta o novo, cai no legado se não existir
        }))
      };
    });
  }
}


