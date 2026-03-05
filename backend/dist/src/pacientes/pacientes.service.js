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
exports.PacientesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let PacientesService = class PacientesService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(dto) {
        return this.databaseService.client.paciente.create({
            data: {
                nome: dto.nome,
                dataNascimento: new Date(dto.dataNascimento),
                necessidades: dto.necessidades,
                endereco: dto.endereco ? {
                    create: {
                        ...dto.endereco
                    }
                } : undefined,
                familiares: dto.familiarId ? {
                    create: {
                        userId: dto.familiarId,
                        parentesco: dto.parentesco || 'Responsável',
                        isResponsavelFinanceiro: dto.isResponsavelFinanceiro
                    }
                } : undefined
            },
            include: {
                endereco: true,
                familiares: {
                    include: { user: true }
                }
            }
        });
    }
    async findAll() {
        return this.databaseService.client.paciente.findMany({
            include: {
                endereco: true
            },
            orderBy: { dataCadastro: 'desc' },
        });
    }
    async findOne(id) {
        return this.databaseService.client.paciente.findUnique({
            where: { id },
            include: {
                endereco: true,
                familiares: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nome: true,
                                email: true,
                                telefone: true,
                                cpf: true,
                            },
                        },
                    },
                },
                cuidadores: {
                    include: {
                        cuidador: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        nome: true,
                                        email: true,
                                        telefone: true,
                                    },
                                },
                            },
                        },
                    },
                },
                plantoes: {
                    where: {
                        status: 'APROVADO'
                    },
                    include: {
                        relatorioAtividade: true
                    },
                    orderBy: {
                        dataInicio: 'desc'
                    }
                }
            },
        });
    }
    async update(id, dto) {
        const { endereco, ...dadosPaciente } = dto;
        return this.databaseService.client.paciente.update({
            where: { id },
            data: {
                ...dadosPaciente,
                ...(dto.dataNascimento && {
                    dataNascimento: new Date(dto.dataNascimento)
                }),
                ...(endereco && {
                    endereco: {
                        update: {
                            ...endereco
                        }
                    }
                })
            },
            include: {
                endereco: true,
                familiares: {
                    include: { user: true }
                }
            }
        });
    }
    async vincularCuidador(pacienteId, idRecebido, valorHora) {
        try {
            let cuidador = await this.databaseService.client.cuidadorDetalhes.findFirst({
                where: {
                    OR: [
                        { id: idRecebido },
                        { userId: idRecebido }
                    ]
                }
            });
            if (!cuidador) {
                throw new common_1.NotFoundException('Cuidador não encontrado no sistema.');
            }
            return await this.databaseService.client.cuidadorPacienteVinculo.create({
                data: {
                    pacienteId: pacienteId,
                    cuidadorId: cuidador.id,
                    valorHoraAcordado: valorHora,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Este cuidador já está vinculado a este paciente.');
            }
            throw error;
        }
    }
    async removerVinculoCuidador(vinculoId) {
        try {
            return await this.databaseService.client.cuidadorPacienteVinculo.delete({
                where: { id: vinculoId },
            });
        }
        catch (error) {
            throw new Error('Não foi possível remover o vínculo. Verifique se o registro existe.');
        }
    }
};
exports.PacientesService = PacientesService;
exports.PacientesService = PacientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PacientesService);
//# sourceMappingURL=pacientes.service.js.map