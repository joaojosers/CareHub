import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePlantaoDto } from './dto/create-plantao.dto';
import { PlantaoStatus } from '@prisma/client';
import { PagamentosService } from '../pagamentos/pagamentos.service';

@Injectable()
export class PlantoesService {
    // 1. Mantenha os nomes consistentes (usei 'database' para bater com o restante do seu código)
    constructor(
        private database: DatabaseService, 
        private pagamentosService: PagamentosService
    ) { }
    
    async create(dto: CreatePlantaoDto) {
        const inicio = new Date(dto.dataInicio);
        const fim = new Date(dto.dataFim);

        if (fim <= inicio) {
            throw new BadRequestException('A data de fim deve ser posterior à data de início');
        }

        // Calcular horas trabalhadas
        const diffMs = fim.getTime() - inicio.getTime();
        const horasTrabalhadas = diffMs / (1000 * 60 * 60);

        // Verificar se o paciente existe
        const paciente = await this.database.client.paciente.findUnique({
            where: { id: dto.pacienteId },
        });
        if (!paciente) throw new NotFoundException('Paciente não encontrado');

        if (dto.cuidadorId) {
            // Tenta achar o CuidadorDetalhes onde userId = dto.cuidadorId
            const cuidadorDetalhes = await this.database.client.cuidadorDetalhes.findUnique({
                where: { userId: dto.cuidadorId },
            });

            if (!cuidadorDetalhes) {
                // Se não achou pelo userId, tenta achar pelo ID direto
                const direto = await this.database.client.cuidadorDetalhes.findUnique({
                    where: { id: dto.cuidadorId },
                });

                if (!direto) {
                    throw new NotFoundException('Cuidador não encontrado (ID inválido)');
                }
            } else {
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
                status: PlantaoStatus.PENDENTE,
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

    async findByCuidador(userId: string) {
        const cuidador = await this.database.client.cuidadorDetalhes.findUnique({
            where: { userId }
        });

        if (!cuidador) throw new NotFoundException('Perfil de cuidador não encontrado');

        return this.database.client.plantao.findMany({
            where: { cuidadorId: cuidador.id },
            include: {
                paciente: true,
                relatorioAtividade: true,
            },
            orderBy: { dataInicio: 'desc' }
        });
    }

    async findByFamiliar(userId: string) {
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

    async updateStatus(id: string, status: PlantaoStatus) {
        const plantao = await this.database.client.plantao.findUnique({
            where: { id }
        });

        if (!plantao) throw new NotFoundException('Plantão não encontrado');

        return this.database.client.plantao.update({
            where: { id },
            data: { status },
            include: { relatorioAtividade: true }
        });
    }

    async aprovarPlantao(id: string) {
        // 1. Verificar se o plantão existe antes de tentar o update
        const plantaoExiste = await this.database.client.plantao.findUnique({
            where: { id }
        });

        if (!plantaoExiste) {
            throw new NotFoundException(`Plantão ${id} não encontrado`);
        }

        // 2. Atualiza o status usando o nome correto: 'database'
        const plantao = await this.database.client.plantao.update({
            where: { id },
            data: { status: PlantaoStatus.APROVADO }, // Use o Enum para evitar strings soltas
        });

        // 3. Criação automática do pagamento
        try {
            await this.pagamentosService.create({
                plantaoId: id,
                metodoPagamento: 'PIX', 
            });
            
            return { 
                message: 'Plantão aprovado e faturamento gerado.', 
                plantao 
            };
        } catch (error) {
            // Log do erro para o desenvolvedor
            console.error('Erro no faturamento automático:', error.message);
            
            // Retorna um status de sucesso parcial, pois o plantão FOI aprovado
            return { 
                message: 'Plantão aprovado. O faturamento deve ser revisado manualmente.', 
                plantao 
            };
        }
    }
}


