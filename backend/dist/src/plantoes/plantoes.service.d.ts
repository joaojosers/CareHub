import { DatabaseService } from '../database/database.service';
import { CreatePlantaoDto } from './dto/create-plantao.dto';
import { PagamentosService } from '../pagamentos/pagamentos.service';
export declare class PlantoesService {
    private database;
    private pagamentosService;
    constructor(database: DatabaseService, pagamentosService: PagamentosService);
    create(dto: CreatePlantaoDto): Promise<{
        cuidador: ({
            user: {
                id: string;
                email: string;
                cpf: string;
                tipo: import("@prisma/client").$Enums.UserRole;
                nome: string;
                senha: string;
                telefone: string | null;
                status: import("@prisma/client").$Enums.UserStatus;
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
            nome: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
        relatorioAtividade: {
            id: string;
            plantaoId: string;
            criadoEm: Date;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        pacienteId: string;
        cuidadorId: string | null;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
    }>;
    findAll(): Promise<({
        cuidador: ({
            user: {
                id: string;
                email: string;
                cpf: string;
                tipo: import("@prisma/client").$Enums.UserRole;
                nome: string;
                senha: string;
                telefone: string | null;
                status: import("@prisma/client").$Enums.UserStatus;
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
            nome: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
        relatorioAtividade: {
            id: string;
            plantaoId: string;
            criadoEm: Date;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        pacienteId: string;
        cuidadorId: string | null;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
    })[]>;
    findByCuidador(userId: string): Promise<({
        paciente: {
            id: string;
            nome: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
        relatorioAtividade: {
            id: string;
            plantaoId: string;
            criadoEm: Date;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        pacienteId: string;
        cuidadorId: string | null;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
    })[]>;
    findByFamiliar(userId: string): Promise<({
        cuidador: ({
            user: {
                id: string;
                email: string;
                cpf: string;
                tipo: import("@prisma/client").$Enums.UserRole;
                nome: string;
                senha: string;
                telefone: string | null;
                status: import("@prisma/client").$Enums.UserStatus;
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
            nome: string;
            status: import("@prisma/client").$Enums.PacienteStatus;
            dataCadastro: Date;
            dataNascimento: Date;
            necessidades: string | null;
        };
        relatorioAtividade: {
            id: string;
            plantaoId: string;
            criadoEm: Date;
            descricao: string;
            medicacoes: string | null;
            pressaoArterial: string | null;
            observacoes: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PlantaoStatus;
        pacienteId: string;
        cuidadorId: string | null;
        dataInicio: Date;
        dataFim: Date;
        horasTrabalhadas: number;
        valorPago: import("@prisma/client-runtime-utils").Decimal;
        dataCriacao: Date;
        relatorioLegacy: string | null;
    })[]>;
    aprovarPlantao(id: string): Promise<{
        message: string;
        plantao: {
            id: string;
            status: import("@prisma/client").$Enums.PlantaoStatus;
            pacienteId: string;
            cuidadorId: string | null;
            dataInicio: Date;
            dataFim: Date;
            horasTrabalhadas: number;
            valorPago: import("@prisma/client-runtime-utils").Decimal;
            dataCriacao: Date;
            relatorioLegacy: string | null;
        };
    }>;
}
