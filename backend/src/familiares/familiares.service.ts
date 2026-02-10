import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { VincularPacienteDto } from './dto/vincular-paciente.dto';

@Injectable()
export class FamiliaresService {
    constructor(private databaseService: DatabaseService) { }

    async vincularPaciente(userId: string, dto: VincularPacienteDto) {
        const paciente = await this.databaseService.client.paciente.findUnique({
            where: { id: dto.pacienteId },
        });

        if (!paciente) {
            throw new NotFoundException('Paciente não encontrado');
        }

        const vinculoExistente = await this.databaseService.client.familiarVinculo.findUnique({
            where: {
                userId_pacienteId: {
                    userId,
                    pacienteId: dto.pacienteId,
                },
            },
        });

        if (vinculoExistente) {
            throw new ConflictException('Você já possui um vínculo com este paciente');
        }

        return this.databaseService.client.familiarVinculo.create({
            data: {
                userId,
                pacienteId: dto.pacienteId,
                parentesco: dto.parentesco,
                isResponsavelFinanceiro: dto.isResponsavelFinanceiro || false,
            },
            include: {
                paciente: true,
            },
        });
    }

    async findMeusPacientes(userId: string) {
        return this.databaseService.client.familiarVinculo.findMany({
            where: { userId },
            include: {
                paciente: true,
            },
        });
    }
}
