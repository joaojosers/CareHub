import { UsersService } from './users.service';
import { UserRole, UserStatus } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(status?: UserStatus, tipo?: UserRole): Promise<{
        id: string;
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }[]>;
    findOne(id: string): Promise<({
        familiares: ({
            paciente: {
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
            } & {
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
        })[];
    } & {
        id: string;
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        senha: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }) | null>;
    approveUser(id: string): Promise<{
        id: string;
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        senha: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }>;
    rejectUser(id: string): Promise<{
        id: string;
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        senha: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }>;
}
