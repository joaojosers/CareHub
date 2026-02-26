import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from './pacientes.service';
import { DatabaseService } from '../database/database.service';

// Mockamos o Prisma focado na tabela de "paciente"
const mockDatabaseService = {
    client: {
        paciente: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    },
};

describe('PacientesService', () => {
    let service: PacientesService;
    let database: typeof mockDatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PacientesService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<PacientesService>(PacientesService);
        database = module.get(DatabaseService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('deve criar um paciente convertendo a string de data para objeto Date e aninhando o endereço', async () => {
            // Simulamos o payload que chega do Controller (Data em string)
            const createDtoMock: any = {
                nome: 'Sr. Alberto',
                dataNascimento: '1945-05-12T00:00:00.000Z', // String ISO
                necessidades: 'Acompanhamento para Alzheimer e mobilidade reduzida',
                endereco: {
                    logradouro: 'Rua das Flores',
                    numero: '123',
                    bairro: 'Jardim Primavera',
                    cidade: 'São Paulo',
                    estado: 'SP',
                    cep: '01000000',
                }
            };

            // Simulamos o retorno do banco (Data já convertida para objeto Date)
            const mockCreatedPaciente = { 
                id: 'uuid-paciente-123', 
                ...createDtoMock, 
                dataNascimento: new Date(createDtoMock.dataNascimento) 
            };
            
            database.client.paciente.create.mockResolvedValue(mockCreatedPaciente);

            const result = await service.create(createDtoMock);

            // Verificamos se o Service fez a conversão new Date() corretamente antes de enviar ao Prisma
            expect(database.client.paciente.create).toHaveBeenCalledWith({
                data: {
                    nome: createDtoMock.nome,
                    dataNascimento: new Date(createDtoMock.dataNascimento), // Aqui validamos a conversão!
                    necessidades: createDtoMock.necessidades,
                    endereco: {
                        create: { ...createDtoMock.endereco }
                    }
                },
                include: {
                    endereco: true
                }
            });

            expect(result).toEqual(mockCreatedPaciente);
        });
    });

    describe('findAll', () => {
        it('deve retornar todos os pacientes ordenados por dataCadastro e incluir endereços', async () => {
            const mockPacientes = [{ id: '1', nome: 'Sr. Alberto' }, { id: '2', nome: 'Dona Maria' }];
            database.client.paciente.findMany.mockResolvedValue(mockPacientes);

            const result = await service.findAll();

            expect(database.client.paciente.findMany).toHaveBeenCalledWith({
                include: {
                    endereco: true
                },
                orderBy: { dataCadastro: 'desc' },
            });
            expect(result).toEqual(mockPacientes);
        });
    });

    describe('findOne', () => {
        it('deve retornar um paciente específico pelo ID com seu endereço', async () => {
            const mockPaciente = { id: 'uuid-123', nome: 'Sr. Alberto' };
            database.client.paciente.findUnique.mockResolvedValue(mockPaciente);

            const result = await service.findOne('uuid-123');

            expect(database.client.paciente.findUnique).toHaveBeenCalledWith({
                where: { id: 'uuid-123' },
                include: {
                    endereco: true
                }
            });
            expect(result).toEqual(mockPaciente);
        });
    });
});