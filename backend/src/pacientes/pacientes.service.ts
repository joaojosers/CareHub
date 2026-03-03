import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePacienteDto } from './dto/pacientes.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';


@Injectable()
export class PacientesService {
    constructor(private databaseService: DatabaseService) { }

    async create(dto: CreatePacienteDto) {
        return this.databaseService.client.paciente.create({
            data: {
                nome: dto.nome,
                dataNascimento: new Date(dto.dataNascimento),
                necessidades: dto.necessidades,
                endereco: dto.endereco ? {
                    create: {
                        ...dto.endereco
                    }
                } : undefined
            },
            include: {
                endereco: true
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

    async findOne(id: string) {
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
                // ADIÇÃO CRUCIAL PARA O PRONTUÁRIO:
                plantoes: {
                    where: {
                        status: 'APROVADO' // No prontuário só entra evolução validada
                    },
                    include: {
                        relatorioAtividade: true // Traz a descrição, PA, medicação, etc.
                    },
                    orderBy: {
                        dataInicio: 'desc' // Organiza do mais recente para o mais antigo
                    }
                }
            },
        });
    }

    // --- NOVO MÉTODO PARA RESOLVER O ERRO NO CONTROLLER ---
    async update(id: string, dto: UpdatePacienteDto) {
        const { endereco, ...dadosPaciente } = dto;

        return this.databaseService.client.paciente.update({
            where: { id },
            data: {
                ...dadosPaciente,
                // Se a data de nascimento vier como string, converte para Date
                ...(dto.dataNascimento && {
                    dataNascimento: new Date(dto.dataNascimento)
                }),
                // Atualização aninhada do endereço
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

    async vincularCuidador(pacienteId: string, idRecebido: string, valorHora: number) {
        try {
            // 1. Primeiro, verificamos se o ID enviado é de um User ou já é do CuidadorDetalhes
            let cuidador = await this.databaseService.client.cuidadorDetalhes.findFirst({
            where: {
                OR: [
                { id: idRecebido },    // Tenta como ID da tabela de detalhes
                { userId: idRecebido } // Tenta como ID da tabela de usuário
                ]
            }
            });

            if (!cuidador) {
            throw new NotFoundException('Cuidador não encontrado no sistema.');
            }

            // 2. Agora usamos o ID CERTO da tabela de detalhes para criar o vínculo
            return await this.databaseService.client.cuidadorPacienteVinculo.create({
            data: {
                pacienteId: pacienteId,
                cuidadorId: cuidador.id, // Aqui garantimos o ID da tabela correta
                valorHoraAcordado: valorHora,
            },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
            throw new ConflictException('Este cuidador já está vinculado a este paciente.');
            }
            throw error;
        }
    }
    
    async removerVinculoCuidador(vinculoId: string) {
        try {
            return await this.databaseService.client.cuidadorPacienteVinculo.delete({
            where: { id: vinculoId },
            });
        }  catch (error) {
        throw new Error('Não foi possível remover o vínculo. Verifique se o registro existe.');
        }
    }
}