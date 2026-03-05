"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuidadoresService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
let CuidadoresService = class CuidadoresService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(dto) {
        const existingUser = await this.databaseService.client.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { cpf: dto.cpf }],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('E-mail ou CPF já cadastrados no sistema');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.senha, salt);
        return this.databaseService.client.user.create({
            data: {
                nome: dto.nome,
                email: dto.email,
                senha: hashedPassword,
                cpf: dto.cpf,
                telefone: dto.telefone,
                tipo: client_1.UserRole.CUIDADOR,
                endereco: dto.endereco ? {
                    create: {
                        ...dto.endereco
                    }
                } : undefined,
                cuidador: {
                    create: {
                        especialidades: dto.especialidades || [],
                        dadosBancarios: dto.dadosBancarios || {},
                        mercadoPago: null,
                        documentos: dto.documentos ? {
                            create: dto.documentos.map(doc => ({
                                tipo: doc.tipo,
                                url: doc.url,
                            }))
                        } : undefined,
                    },
                },
            },
            include: {
                endereco: true,
                cuidador: {
                    include: {
                        documentos: true
                    }
                },
            },
        });
    }
    async findAll() {
        return this.databaseService.client.user.findMany({
            where: { tipo: client_1.UserRole.CUIDADOR },
            include: {
                endereco: true,
                cuidador: {
                    include: {
                        documentos: true,
                        _count: {
                            select: { pacientes: true }
                        }
                    }
                },
            },
            orderBy: { dataCadastro: 'desc' },
        });
    }
    async findOne(id) {
        const cuidador = await this.databaseService.client.user.findUnique({
            where: { id, tipo: client_1.UserRole.CUIDADOR },
            include: {
                endereco: true,
                cuidador: {
                    include: {
                        documentos: true,
                        pacientes: {
                            include: {
                                paciente: true
                            }
                        },
                        plantoes: {
                            take: 10,
                            orderBy: { dataInicio: 'desc' },
                            include: {
                                paciente: {
                                    select: { nome: true }
                                }
                            }
                        },
                        pagamentos: {
                            take: 5,
                            orderBy: { criadoEm: 'desc' }
                        }
                    }
                },
            },
        });
        if (!cuidador) {
            throw new common_1.NotFoundException('Cuidador não encontrado');
        }
        return cuidador;
    }
    async findPacientesByCuidador(userId) {
        const detalhes = await this.databaseService.client.cuidadorDetalhes.findUnique({
            where: { userId: userId },
            include: {
                pacientes: {
                    include: {
                        paciente: {
                            include: {
                                endereco: true
                            }
                        }
                    }
                }
            }
        });
        if (!detalhes)
            return [];
        return detalhes.pacientes.map(v => ({
            ...v.paciente,
            valorHora: v.valorHoraAcordado,
            dataInicio: v.dataVinculo
        }));
    }
};
exports.CuidadoresService = CuidadoresService;
exports.CuidadoresService = CuidadoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CuidadoresService);
//# sourceMappingURL=cuidadores.service.js.map