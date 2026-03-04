import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePlantaoDto } from './dto/create-plantao.dto';
import { PlantaoStatus } from '@prisma/client';

@Injectable()
export class PlantoesService {
    constructor(private database: DatabaseService) { }

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
                // Se não achou pelo userId, tenta achar pelo ID direto (caso o frontend tenha mandado o ID interno)
                const direto = await this.database.client.cuidadorDetalhes.findUnique({
                    where: { id: dto.cuidadorId },
                });

                if (!direto) {
                    throw new NotFoundException('Cuidador não encontrado (ID inválido)');
                }
                // Se achou direto, usa o ID original
            } else {
                // Se achou pelo userId, substitui o ID usado para criar o plantão
                dto.cuidadorId = cuidadorDetalhes.id;
            }
        }

        const plantao = await this.database.client.plantao.create({
            data: {
                pacienteId: dto.pacienteId,
                cuidadorId: dto.cuidadorId || null,
                dataInicio: inicio,
                dataFim: fim,
                horasTrabalhadas,
                relatorio: dto.relatorio,
                status: PlantaoStatus.PENDENTE,
            },
            include: {
                paciente: true,
                cuidador: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }

    async findAll() {
        return this.database.client.plantao.findMany({
            include: {
                paciente: true,
                cuidador: { include: { user: true } }
            },
            orderBy: { dataInicio: 'desc' }
        });
    }

    async findByCuidador(userId: string) {
        // Primeiro achar o Detalhe do cuidador pelo userId
        const cuidador = await this.database.client.cuidadorDetalhes.findUnique({
            where: { userId }
        });

        if (!cuidador) throw new NotFoundException('Perfil de cuidador não encontrado');

        return this.database.client.plantao.findMany({
            where: { cuidadorId: cuidador.id },
            include: { paciente: true },
            orderBy: { dataInicio: 'desc' }
        });
    }

    async findByFamiliar(userId: string) {
        // Achar pacientes vinculados ao familiar
        const vinculos = await this.database.client.familiarVinculo.findMany({
            where: { userId }
        });

        const pacienteIds = vinculos.map(v => v.pacienteId);

        return this.database.client.plantao.findMany({
            where: { pacienteId: { in: pacienteIds } },
            include: {
                paciente: true,
                cuidador: { include: { user: true } }
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
            data: { status }
        });
    }
}
