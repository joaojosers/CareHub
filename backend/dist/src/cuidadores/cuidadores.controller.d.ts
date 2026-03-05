import { CuidadoresService } from './cuidadores.service';
import { CreateCuidadorDto } from './dto/create-cuidador.dto';
export declare class CuidadoresController {
    private readonly cuidadoresService;
    constructor(cuidadoresService: CuidadoresService);
    create(createCuidadorDto: CreateCuidadorDto): Promise<{
        cuidador: ({
            documentos: {
                url: string;
                id: string;
                tipo: string;
                status: import("@prisma/client").$Enums.UserStatus;
                cuidadorId: string;
                dataSubmissao: Date;
                conferidoEm: Date | null;
                conferidoPor: string | null;
            }[];
        } & {
            id: string;
            userId: string;
            documentosJson: import("@prisma/client/runtime/client").JsonValue | null;
            dadosBancarios: import("@prisma/client/runtime/client").JsonValue | null;
            mercadoPago: string | null;
            especialidades: string[];
            valorHora: import("@prisma/client-runtime-utils").Decimal;
        }) | null;
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
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        senha: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }>;
    findAll(): Promise<({
        cuidador: ({
            documentos: {
                url: string;
                id: string;
                tipo: string;
                status: import("@prisma/client").$Enums.UserStatus;
                cuidadorId: string;
                dataSubmissao: Date;
                conferidoEm: Date | null;
                conferidoPor: string | null;
            }[];
            _count: {
                pacientes: number;
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
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        senha: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    })[]>;
    findOne(id: string): Promise<{
        cuidador: ({
            documentos: {
                url: string;
                id: string;
                tipo: string;
                status: import("@prisma/client").$Enums.UserStatus;
                cuidadorId: string;
                dataSubmissao: Date;
                conferidoEm: Date | null;
                conferidoPor: string | null;
            }[];
            plantoes: ({
                paciente: {
                    nome: string;
                };
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
            pagamentos: {
                id: string;
                status: import("@prisma/client").$Enums.PagamentoStatus;
                cuidadorId: string;
                plantaoId: string;
                valorBruto: import("@prisma/client-runtime-utils").Decimal;
                valorLiquido: import("@prisma/client-runtime-utils").Decimal;
                taxaPlataforma: import("@prisma/client-runtime-utils").Decimal;
                metodoPagamento: import("@prisma/client").$Enums.MetodoPagamento;
                dataPagamento: Date | null;
                numeroComprovante: string | null;
                criadoEm: Date;
                atualizadoEm: Date;
            }[];
            pacientes: ({
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
                pacienteId: string;
                cuidadorId: string;
                valorHoraAcordado: import("@prisma/client-runtime-utils").Decimal;
                dataVinculo: Date;
            })[];
        } & {
            id: string;
            userId: string;
            documentosJson: import("@prisma/client/runtime/client").JsonValue | null;
            dadosBancarios: import("@prisma/client/runtime/client").JsonValue | null;
            mercadoPago: string | null;
            especialidades: string[];
            valorHora: import("@prisma/client-runtime-utils").Decimal;
        }) | null;
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
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        senha: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }>;
    getPacientes(id: string): Promise<{
        valorHora: import("@prisma/client-runtime-utils").Decimal;
        dataInicio: Date;
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
        id: string;
        nome: string;
        status: import("@prisma/client").$Enums.PacienteStatus;
        dataCadastro: Date;
        dataNascimento: Date;
        necessidades: string | null;
    }[]>;
}
