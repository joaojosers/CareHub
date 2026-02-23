import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePacienteDto } from './dto/pacientes.dto';

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
                endereco: true
            }
        });
    }
}

