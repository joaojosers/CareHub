import { Test, TestingModule } from '@nestjs/testing';
import { CuidadoresService } from './cuidadores.service';
import { DatabaseService } from '../database/database.service';
import { ConflictException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Interceptamos o bcrypt para não deixar o teste lento
jest.mock('bcrypt');

const mockDatabaseService = {
    client: {
        user: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    },
};

describe('CuidadoresService', () => {
    let service: CuidadoresService;
    let database: typeof mockDatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CuidadoresService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<CuidadoresService>(CuidadoresService);
        database = module.get(DatabaseService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        // Criamos um DTO bem completo para testar as criações aninhadas
        const createDtoMock: any = {
            nome: 'Ana Souza',
            email: 'ana@email.com',
            senha: 'senha123',
            cpf: '12345678901',
            telefone: '11999999999',
            especialidades: ['Idosos', 'Mobilidade Reduzida'],
            endereco: {
                logradouro: 'Rua A',
                numero: '123',
                bairro: 'Centro',
                cidade: 'São Paulo',
                estado: 'SP',
                cep: '01000000',
            },
            documentos: [
                { tipo: 'RG', url: 'http://s3.com/rg.pdf' }
            ]
        };

        it('deve lançar ConflictException se o email ou CPF já existirem', async () => {
            // Simulamos que o findFirst encontrou alguém no banco
            database.client.user.findFirst.mockResolvedValue({ id: 'usuario-existente' });

            // Verificamos se a exceção correta é disparada
            await expect(service.create(createDtoMock)).rejects.toThrow(ConflictException);

            // Garantimos que o findFirst buscou usando as condições certas
            expect(database.client.user.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [{ email: createDtoMock.email }, { cpf: createDtoMock.cpf }],
                },
            });

            // Garantimos que a criação nunca foi chamada
            expect(database.client.user.create).not.toHaveBeenCalled();
            expect(bcrypt.hash).not.toHaveBeenCalled();
        });

        it('deve criptografar a senha e criar o cuidador com relações aninhadas', async () => {
            // Simulamos que não existe ninguém com esse email/cpf
            database.client.user.findFirst.mockResolvedValue(null);

            // Mockamos o comportamento do bcrypt
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (bcrypt.hash as jest.Mock).mockResolvedValue('senha-hash');

            const mockCreatedUser = { id: 'novo-uuid', ...createDtoMock, senha: 'senha-hash' };
            database.client.user.create.mockResolvedValue(mockCreatedUser);

            const result = await service.create(createDtoMock);

            // Verifica se a estrutura complexa do Prisma foi montada corretamente
            expect(database.client.user.create).toHaveBeenCalledWith({
                data: {
                    nome: createDtoMock.nome,
                    email: createDtoMock.email,
                    senha: 'senha-hash', // A senha deve estar criptografada
                    cpf: createDtoMock.cpf,
                    telefone: createDtoMock.telefone,
                    tipo: UserRole.CUIDADOR,
                    endereco: {
                        create: { ...createDtoMock.endereco }
                    },
                    cuidador: {
                        create: {
                            especialidades: createDtoMock.especialidades,
                            dadosBancarios: {},
                            mercadoPago: null,
                            documentos: {
                                create: [
                                    { tipo: 'RG', url: 'http://s3.com/rg.pdf' }
                                ]
                            }
                        }
                    }
                },
                include: {
                    endereco: true,
                    cuidador: { include: { documentos: true } }
                }
            });

            expect(result).toEqual(mockCreatedUser);
        });
    });

    describe('findAll', () => {
        it('deve retornar todos os usuários do tipo CUIDADOR incluindo suas relações', async () => {
            const mockUsers = [{ id: '1', nome: 'Ana' }];
            database.client.user.findMany.mockResolvedValue(mockUsers);

            const result = await service.findAll();

            expect(database.client.user.findMany).toHaveBeenCalledWith({
                where: { tipo: UserRole.CUIDADOR },
                include: {
                    endereco: true,
                    cuidador: {
                        include: {
                            documentos: true,
                            _count: {
                                select: { pacientes: true }
                            }
                        }
                    }
                },
                orderBy: { dataCadastro: 'desc' },
            });
            expect(result).toEqual(mockUsers);
        });
    });

    describe('findOne', () => {
        it('deve retornar um cuidador específico pelo ID', async () => {
            const mockUser = { id: 'uuid-123', nome: 'Ana' };
            database.client.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.findOne('uuid-123');

            expect(database.client.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'uuid-123', tipo: UserRole.CUIDADOR },
                include: {
                    endereco: true,
                    cuidador: {
                        include: {
                            documentos: true,
                            pacientes: {
                                include: { paciente: true }
                            },
                            plantoes: {
                                take: 10,
                                orderBy: { dataInicio: 'desc' },
                                include: { paciente: { select: { nome: true } } }
                            },
                            pagamentos: {
                                take: 5,
                                orderBy: { criadoEm: 'desc' }
                            }
                        }
                    }
                }
            });
            expect(result).toEqual(mockUser);
        });
    });
});