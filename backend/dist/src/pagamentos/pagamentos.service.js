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
exports.PagamentosService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
const TAXA_PLATAFORMA = 0.10;
let PagamentosService = class PagamentosService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(dto) {
        const { plantaoId, metodoPagamento } = dto;
        const plantao = await this.databaseService.client.plantao.findUnique({
            where: { id: plantaoId },
            include: {
                cuidador: true,
            },
        });
        if (!plantao) {
            throw new common_1.NotFoundException(`Plantão ${plantaoId} não encontrado`);
        }
        if (plantao.status !== 'APROVADO') {
            throw new common_1.BadRequestException(`Apenas plantões APROVADO podem ser pagos. Status atual: ${plantao.status}`);
        }
        if (!plantao.cuidadorId || !plantao.cuidador) {
            throw new common_1.BadRequestException('Plantão não possui cuidador atribuído');
        }
        const existing = await this.databaseService.client.pagamento.findUnique({
            where: { plantaoId },
        });
        if (existing) {
            throw new common_1.ConflictException(`Já existe um pagamento para o plantão ${plantaoId}`);
        }
        const valorHora = plantao.cuidador.valorHora ?? new client_1.Prisma.Decimal(20);
        const valorBruto = new client_1.Prisma.Decimal(plantao.horasTrabalhadas).mul(valorHora);
        const taxaPlataforma = valorBruto.mul(new client_1.Prisma.Decimal(TAXA_PLATAFORMA));
        const valorLiquido = valorBruto.sub(taxaPlataforma);
        return this.databaseService.client.pagamento.create({
            data: {
                plantaoId,
                cuidadorId: plantao.cuidadorId,
                valorBruto,
                valorLiquido,
                taxaPlataforma,
                status: client_1.PagamentoStatus.PENDENTE,
                metodoPagamento: metodoPagamento ?? client_1.MetodoPagamento.PIX,
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
    async findAll(mes, status, cuidadorId) {
        let dateFilter;
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
    async findMy(cuidadorId) {
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
    async findById(id) {
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
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        return pagamento;
    }
    async marcarComoProcessado(id) {
        const pagamento = await this.findById(id);
        if (pagamento.status !== client_1.PagamentoStatus.PENDENTE) {
            throw new common_1.BadRequestException(`Apenas pagamentos PENDENTE podem ser processados. Status atual: ${pagamento.status}`);
        }
        return this.databaseService.client.pagamento.update({
            where: { id },
            data: { status: client_1.PagamentoStatus.PROCESSADO },
            include: {
                plantao: { include: { paciente: true } },
                cuidador: { include: { user: true } },
            },
        });
    }
    async confirmarPagamento(id, dto) {
        const pagamento = await this.findById(id);
        if (pagamento.status !== client_1.PagamentoStatus.PROCESSADO) {
            throw new common_1.BadRequestException(`Apenas pagamentos PROCESSADO podem ser confirmados. Status atual: ${pagamento.status}`);
        }
        return this.databaseService.client.pagamento.update({
            where: { id },
            data: {
                status: client_1.PagamentoStatus.PAID,
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
    async gerarRelatorio(mes) {
        const [ano, mesNum] = mes.split('-').map(Number);
        if (isNaN(ano) || isNaN(mesNum)) {
            throw new common_1.BadRequestException('Mês inválido. Use formato YYYY-MM');
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
            throw new common_1.NotFoundException(`Nenhum pagamento encontrado para ${mes}`);
        }
        const pagamentosTyped = pagamentos;
        const resumo = {
            mes,
            totalPagamentos: pagamentos.length,
            totalCuidadores: new Set(pagamentos.map((p) => p.cuidadorId)).size,
            totalHoras: pagamentosTyped.reduce((sum, p) => sum + (p.plantao?.horasTrabalhadas ?? 0), 0),
            totalBruto: pagamentos.reduce((sum, p) => sum + Number(p.valorBruto), 0),
            totalLiquido: pagamentos.reduce((sum, p) => sum + Number(p.valorLiquido), 0),
            totalTaxaPlataforma: pagamentos.reduce((sum, p) => sum + Number(p.taxaPlataforma), 0),
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
    async delete(id) {
        const pagamento = await this.findById(id);
        if (pagamento.status !== client_1.PagamentoStatus.PENDENTE) {
            throw new common_1.BadRequestException('Apenas pagamentos PENDENTE podem ser deletados');
        }
        return this.databaseService.client.pagamento.delete({
            where: { id },
        });
    }
};
exports.PagamentosService = PagamentosService;
exports.PagamentosService = PagamentosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PagamentosService);
//# sourceMappingURL=pagamentos.service.js.map