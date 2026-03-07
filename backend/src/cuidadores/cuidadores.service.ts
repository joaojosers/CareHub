import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCuidadorDto } from './dto/create-cuidador.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CuidadoresService {
    constructor(private databaseService: DatabaseService) { }

    async create(dto: CreateCuidadorDto) {
        // 1. Verificar se e-mail ou CPF já existem
        const existingUser = await this.databaseService.client.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { cpf: dto.cpf }],
            },
        });

        if (existingUser) {
            throw new ConflictException('E-mail ou CPF já cadastrados no sistema');
        }

        // 2. Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.senha, salt);

        // 3. Criar Usuário, Detalhes do Cuidador, Endereço e Documentos em uma transação
        return this.databaseService.client.user.create({
            data: {
                nome: dto.nome,
                email: dto.email,
                senha: hashedPassword,
                cpf: dto.cpf,
                telefone: dto.telefone,
                tipo: UserRole.CUIDADOR,
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
            where: { tipo: UserRole.CUIDADOR },
            include: {
                endereco: true,
                cuidador: {
                    include: {
                        documentos: true,
                        // Inclui contagem de pacientes para a listagem geral
                        _count: {
                            select: { pacientes: true }
                        }
                    }
                },
            },
            orderBy: { dataCadastro: 'desc' },
        });
    }

    async findOne(id: string) {
        const cuidador = await this.databaseService.client.user.findUnique({
            where: { id, tipo: UserRole.CUIDADOR },
            include: {
                endereco: true,
                cuidador: {
                    include: {
                        documentos: true,
                        // BUSCA OS PACIENTES VINCULADOS
                        pacientes: {
                            include: {
                                paciente: true // Traz os dados básicos do paciente (nome, etc)
                            }
                        },
                        // BUSCA OS ÚLTIMOS PLANTÕES (Histórico)
                        plantoes: {
                            take: 10,
                            orderBy: { dataInicio: 'desc' },
                            include: {
                                paciente: {
                                    select: { nome: true }
                                }
                            }
                        },
                        // BUSCA PAGAMENTOS (Opcional, mas útil para o Admin)
                        pagamentos: {
                            take: 5,
                            orderBy: { criadoEm: 'desc' }
                        }
                    }
                },
            },
        });

        if (!cuidador) {
            throw new NotFoundException('Cuidador não encontrado');
        }

        return cuidador;
    }

    async findPacientesByCuidador(userId: string) {
        // Buscamos o vínculo através do User -> CuidadorDetalhes -> Vinculos -> Paciente
        const detalhes = await this.databaseService.client.cuidadorDetalhes.findUnique({
            where: { userId: userId }, // Assumindo que você tem userId em CuidadorDetalhes
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

        if (!detalhes) return [];

        // Mapeamos para retornar uma lista simples de pacientes
        return detalhes.pacientes.map(v => ({
            ...v.paciente,
            valorHora: v.valorHoraAcordado, // Informação útil do vínculo
            dataInicio: v.dataVinculo
        }));
        }
}