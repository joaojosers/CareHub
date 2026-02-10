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
            },
        });
    }

    async findAll() {
        return this.databaseService.client.paciente.findMany({
            orderBy: { dataCadastro: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.databaseService.client.paciente.findUnique({
            where: { id },
        });
    }
}
