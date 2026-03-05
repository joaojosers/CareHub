import { FamiliaresService } from './familiares.service';
import { VincularPacienteDto } from './dto/vincular-paciente.dto';
export declare class FamiliaresController {
    private readonly familiaresService;
    constructor(familiaresService: FamiliaresService);
    vincular(req: any, dto: VincularPacienteDto): Promise<{
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
    getMeusPacientes(req: any): Promise<({
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
