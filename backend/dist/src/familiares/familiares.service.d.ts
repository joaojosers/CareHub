import { DatabaseService } from '../database/database.service';
import { VincularPacienteDto } from './dto/vincular-paciente.dto';
export declare class FamiliaresService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    vincularPaciente(userId: string, dto: VincularPacienteDto): Promise<{
        paciente: {
            id: string;
            nome: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
    } & {
        id: string;
        userId: string;
        pacienteId: string;
        parentesco: string;
        isResponsavelFinanceiro: boolean;
    }>;
    findMeusPacientes(userId: string): Promise<({
        paciente: {
            id: string;
            nome: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
    } & {
        id: string;
        userId: string;
        pacienteId: string;
        parentesco: string;
        isResponsavelFinanceiro: boolean;
    })[]>;
}
