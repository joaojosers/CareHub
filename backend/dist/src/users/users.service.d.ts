import { DatabaseService } from '../database/database.service';
import { User, Prisma, UserStatus } from '@prisma/client';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    findByEmail(email: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
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
    updateStatus(id: string, status: UserStatus): Promise<User>;
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
                    valorPago: Prisma.Decimal;
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
}
