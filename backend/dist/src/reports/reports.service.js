"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getCaregiverReport(cuidadorId) {
        const pagamentos = await this.prisma.client.pagamento.findMany({
            where: { cuidadorId },
        });
        const plantoes = await this.prisma.client.plantao.findMany({
            where: { cuidadorId, status: 'APROVADO' },
            include: { paciente: true },
        });
        const totalEarned = pagamentos.reduce((acc, p) => acc + Number(p.valorLiquido), 0);
        const totalHours = plantoes.reduce((acc, p) => acc + p.horasTrabalhadas, 0);
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
        }, {});
        return {
            totalEarned,
            totalHours,
            averageHoursPerShift: plantoes.length > 0 ? totalHours / plantoes.length : 0,
            breakdownByPatient: Object.values(byPatient),
        };
    }
    async getFamilyReport(userId) {
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
                    relatorio: p.relatorioAtividade?.descricao || p.relatorioLegacy,
                }))
            };
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map