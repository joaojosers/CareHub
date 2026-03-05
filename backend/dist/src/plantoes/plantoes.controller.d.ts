import { PlantoesService } from './plantoes.service';
import { CreatePlantaoDto } from './dto/create-plantao.dto';
import { PlantaoStatus } from '@prisma/client';
export declare class PlantoesController {
    private readonly plantoesService;
    constructor(plantoesService: PlantoesService);
    create(dto: CreatePlantaoDto): Promise<{
        relatorioAtividade: {
            id: string;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
            criadoEm: Date;
            plantaoId: string;
        } | null;
        cuidador: ({
            user: {
                id: string;
                status: import("@prisma/client").$Enums.UserStatus;
                tipo: import("@prisma/client").$Enums.UserRole;
                nome: string;
                email: string;
                senha: string;
                telefone: string | null;
                cpf: string;
                dataCadastro: Date;
            };
        } & {
            id: string;
            userId: string;
            documentosJson: import("@prisma/client/runtime/client").JsonValue | null;
            dadosBancarios: import("@prisma/client/runtime/client").JsonValue | null;
            mercadoPago: string | null;
            especialidades: string[];
            valorHora: import("@prisma/client-runtime-utils").Decimal;
        }) | null;
        paciente: {
            id: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            nome: string;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
    } & {
        id: string;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
        cuidadorId: string | null;
        pacienteId: string;
    }>;
    findAll(): Promise<({
        relatorioAtividade: {
            id: string;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
            criadoEm: Date;
            plantaoId: string;
        } | null;
        cuidador: ({
            user: {
                id: string;
                status: import("@prisma/client").$Enums.UserStatus;
                tipo: import("@prisma/client").$Enums.UserRole;
                nome: string;
                email: string;
                senha: string;
                telefone: string | null;
                cpf: string;
                dataCadastro: Date;
            };
        } & {
            id: string;
            userId: string;
            documentosJson: import("@prisma/client/runtime/client").JsonValue | null;
            dadosBancarios: import("@prisma/client/runtime/client").JsonValue | null;
            mercadoPago: string | null;
            especialidades: string[];
            valorHora: import("@prisma/client-runtime-utils").Decimal;
        }) | null;
        paciente: {
            id: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            nome: string;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
    } & {
        id: string;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
        cuidadorId: string | null;
        pacienteId: string;
    })[]>;
    findMyPlantoes(req: any): Promise<({
        relatorioAtividade: {
            id: string;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
            criadoEm: Date;
            plantaoId: string;
        } | null;
        paciente: {
            id: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            nome: string;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
    } & {
        id: string;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
        cuidadorId: string | null;
        pacienteId: string;
    })[] | undefined>;
    updateStatus(id: string, status: PlantaoStatus): Promise<{
        message: string;
        plantao: {
            id: string;
            dataInicio: Date;
            dataFim: Date;
            horasTrabalhadas: number;
            status: import("@prisma/client").$Enums.PlantaoStatus;
            valorPago: import("@prisma/client-runtime-utils").Decimal;
            dataCriacao: Date;
            relatorioLegacy: string | null;
            cuidadorId: string | null;
            pacienteId: string;
        };
    }>;
}
