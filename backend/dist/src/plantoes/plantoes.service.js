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
exports.PlantoesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
const pagamentos_service_1 = require("../pagamentos/pagamentos.service");
let PlantoesService = class PlantoesService {
    database;
    pagamentosService;
    constructor(database, pagamentosService) {
        this.database = database;
        this.pagamentosService = pagamentosService;
    }
    async create(dto) {
        const inicio = new Date(dto.dataInicio);
        const fim = new Date(dto.dataFim);
        if (fim <= inicio) {
            throw new common_1.BadRequestException('A data de fim deve ser posterior à data de início');
        }
        const diffMs = fim.getTime() - inicio.getTime();
        const horasTrabalhadas = diffMs / (1000 * 60 * 60);
        const paciente = await this.database.client.paciente.findUnique({
            where: { id: dto.pacienteId },
        });
        if (!paciente)
            throw new common_1.NotFoundException('Paciente não encontrado');
        if (dto.cuidadorId) {
            const cuidadorDetalhes = await this.database.client.cuidadorDetalhes.findUnique({
                where: { userId: dto.cuidadorId },
            });
            if (!cuidadorDetalhes) {
                const direto = await this.database.client.cuidadorDetalhes.findUnique({
                    where: { id: dto.cuidadorId },
                });
                if (!direto) {
                    throw new common_1.NotFoundException('Cuidador não encontrado (ID inválido)');
                }
            }
            else {
                dto.cuidadorId = cuidadorDetalhes.id;
            }
        }
        return this.database.client.plantao.create({
            data: {
                pacienteId: dto.pacienteId,
                cuidadorId: dto.cuidadorId || null,
                dataInicio: inicio,
                dataFim: fim,
                horasTrabalhadas,
                status: client_1.PlantaoStatus.PENDENTE,
                relatorioAtividade: dto.relatorio ? {
                    create: {
                        descricao: dto.relatorio.descricao,
                        medicacoes: dto.relatorio.medicacoes,
                        pressaoArterial: dto.relatorio.pressaoArterial,
                        observacoes: dto.relatorio.observacoes,
                    }
                } : undefined,
            },
            include: {
                paciente: true,
                cuidador: {
                    include: {
                        user: true
                    }
                },
                relatorioAtividade: true,
            }
        });
    }
    async findAll() {
        return this.database.client.plantao.findMany({
            include: {
                paciente: true,
                cuidador: { include: { user: true } },
                relatorioAtividade: true,
            },
            orderBy: { dataInicio: 'desc' }
        });
    }
    async findByCuidador(userId) {
        const cuidador = await this.database.client.cuidadorDetalhes.findUnique({
            where: { userId }
        });
        if (!cuidador)
            throw new common_1.NotFoundException('Perfil de cuidador não encontrado');
        return this.database.client.plantao.findMany({
            where: { cuidadorId: cuidador.id },
            include: {
                paciente: true,
                relatorioAtividade: true,
            },
            orderBy: { dataInicio: 'desc' }
        });
    }
    async findByFamiliar(userId) {
        const vinculos = await this.database.client.familiarVinculo.findMany({
            where: { userId }
        });
        const pacienteIds = vinculos.map(v => v.pacienteId);
        return this.database.client.plantao.findMany({
            where: { pacienteId: { in: pacienteIds } },
            include: {
                paciente: true,
                cuidador: { include: { user: true } },
                relatorioAtividade: true,
            },
            orderBy: { dataInicio: 'desc' }
        });
    }
    async aprovarPlantao(id) {
        const plantaoExiste = await this.database.client.plantao.findUnique({
            where: { id },
            include: { cuidador: true }
        });
        if (!plantaoExiste) {
            throw new common_1.NotFoundException(`Plantão ${id} não encontrado`);
        }
        const plantao = await this.database.client.plantao.update({
            where: { id },
            data: { status: client_1.PlantaoStatus.APROVADO },
        });
        try {
            await this.pagamentosService.create({
                plantaoId: id,
                metodoPagamento: 'PIX',
            });
            return { message: 'Plantão aprovado e faturamento gerado.', plantao };
        }
        catch (error) {
            console.error('ERRO NO PAGAMENTO:', error.message);
            return { message: 'Plantão aprovado, mas erro no faturamento.', plantao };
        }
    }
};
exports.PlantoesService = PlantoesService;
exports.PlantoesService = PlantoesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        pagamentos_service_1.PagamentosService])
], PlantoesService);
//# sourceMappingURL=plantoes.service.js.map