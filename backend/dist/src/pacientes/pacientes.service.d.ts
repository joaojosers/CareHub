import { DatabaseService } from '../database/database.service';
import { CreatePacienteDto } from './dto/pacientes.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
export declare class PacientesService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    create(dto: CreatePacienteDto): Promise<{
        familiares: ({
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
            pacienteId: string;
            parentesco: string;
            isResponsavelFinanceiro: boolean;
        })[];
        endereco: {
            id: string;
            userId: string | null;
            pacienteId: string | null;
            criadoEm: Date;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            referencia: string | null;
        } | null;
    } & {
        id: string;
        nome: string;
        status: import("@prisma/client").$Enums.PacienteStatus;
        dataCadastro: Date;
        dataNascimento: Date;
        necessidades: string | null;
    }>;
    findAll(): Promise<({
        endereco: {
            id: string;
            userId: string | null;
            pacienteId: string | null;
            criadoEm: Date;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            referencia: string | null;
        } | null;
    } & {
        id: string;
        nome: string;
        status: import("@prisma/client").$Enums.PacienteStatus;
        dataCadastro: Date;
        dataNascimento: Date;
        necessidades: string | null;
    })[]>;
    findOne(id: string): Promise<({
        familiares: ({
            user: {
                id: string;
                email: string;
                cpf: string;
                nome: string;
                telefone: string | null;
            };
        } & {
            id: string;
            userId: string;
            pacienteId: string;
            parentesco: string;
            isResponsavelFinanceiro: boolean;
        })[];
        endereco: {
            id: string;
            userId: string | null;
            pacienteId: string | null;
            criadoEm: Date;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            referencia: string | null;
        } | null;
        plantoes: ({
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
        })[];
        cuidadores: ({
            cuidador: {
                user: {
                    id: string;
                    email: string;
                    nome: string;
                    telefone: string | null;
                };
            } & {
                id: string;
                userId: string;
                documentosJson: import("@prisma/client/runtime/client").JsonValue | null;
                dadosBancarios: import("@prisma/client/runtime/client").JsonValue | null;
                mercadoPago: string | null;
                especialidades: string[];
                valorHora: import("@prisma/client-runtime-utils").Decimal;
            };
        } & {
            id: string;
            pacienteId: string;
            cuidadorId: string;
            valorHoraAcordado: import("@prisma/client-runtime-utils").Decimal;
            dataVinculo: Date;
        })[];
    } & {
        id: string;
        nome: string;
        status: import("@prisma/client").$Enums.PacienteStatus;
        dataCadastro: Date;
        dataNascimento: Date;
        necessidades: string | null;
    }) | null>;
    update(id: string, dto: UpdatePacienteDto): Promise<{
        familiares: ({
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
            pacienteId: string;
            parentesco: string;
            isResponsavelFinanceiro: boolean;
        })[];
        endereco: {
            id: string;
            userId: string | null;
            pacienteId: string | null;
            criadoEm: Date;
            logradouro: string;
            numero: string;
            complemento: string | null;
            bairro: string;
            cidade: string;
            estado: string;
            cep: string;
            referencia: string | null;
        } | null;
    } & {
        id: string;
        nome: string;
        status: import("@prisma/client").$Enums.PacienteStatus;
        dataCadastro: Date;
        dataNascimento: Date;
        necessidades: string | null;
    }>;
    vincularCuidador(pacienteId: string, idRecebido: string, valorHora: number): Promise<{
        id: string;
        pacienteId: string;
        cuidadorId: string;
        valorHoraAcordado: import("@prisma/client-runtime-utils").Decimal;
        dataVinculo: Date;
    }>;
    removerVinculoCuidador(vinculoId: string): Promise<{
        id: string;
        pacienteId: string;
        cuidadorId: string;
        valorHoraAcordado: import("@prisma/client-runtime-utils").Decimal;
        dataVinculo: Date;
    }>;
}
