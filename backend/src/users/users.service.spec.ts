import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// 1. Pedimos ao Jest para interceptar a biblioteca bcrypt inteira
jest.mock('bcrypt');

const mockUser = {
    id: 'uuid-valido-123',
    tipo: UserRole.CUIDADOR,
    nome: 'João Silva',
    email: 'joao@email.com',
    senha: 'senha-hash',
    telefone: '11999999999',
    cpf: '12345678900',
    status: UserStatus.PENDENTE,
    dataCadastro: new Date(),
};

// 2. Mockamos o DatabaseService respeitando a estrutura "client.user" do seu código
const mockDatabaseService = {
    client: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    },
};

describe('UsersService', () => {
    let service: UsersService;
    let database: typeof mockDatabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        database = module.get(DatabaseService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('findByEmail', () => {
        it('deve retornar um usuário pelo email', async () => {
            database.client.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.findByEmail('joao@email.com');

            expect(database.client.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'joao@email.com' },
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('create', () => {
        it('deve criptografar a senha e criar o usuário', async () => {
            // Simulamos o comportamento do bcrypt para ele não rodar de verdade e atrasar o teste
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('fakeSalt');
            (bcrypt.hash as jest.Mock).mockResolvedValue('senha-criptografada');
            
            database.client.user.create.mockResolvedValue({ ...mockUser, senha: 'senha-criptografada' });

            const createData = {
                tipo: UserRole.CUIDADOR,
                nome: 'João Silva',
                email: 'joao@email.com',
                senha: 'senha-em-texto-puro',
                cpf: '12345678900',
            };

            const result = await service.create(createData);

            // Garante que o bcrypt foi chamado com a senha em texto puro
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('senha-em-texto-puro', 'fakeSalt');

            // Garante que o Prisma salvou a senha criptografada e não a original
            expect(database.client.user.create).toHaveBeenCalledWith({
                data: {
                    ...createData,
                    senha: 'senha-criptografada',
                },
            });
            expect(result.senha).toBe('senha-criptografada');
        });
    });

    describe('findAll', () => {
        it('deve retornar todos os usuários ordenados por data de cadastro', async () => {
            database.client.user.findMany.mockResolvedValue([mockUser]);

            const result = await service.findAll();

            // Agora o expect reflete exatamente o que está no seu código
            expect(database.client.user.findMany).toHaveBeenCalledWith({
                where: undefined,
                orderBy: { dataCadastro: 'desc' },
            });
            expect(result).toEqual([mockUser]);
        });

        it('deve retornar usuários filtrados por status', async () => {
            database.client.user.findMany.mockResolvedValue([mockUser]);

            const result = await service.findAll(UserStatus.APROVADO);

            expect(database.client.user.findMany).toHaveBeenCalledWith({
                where: { status: UserStatus.APROVADO },
                orderBy: { dataCadastro: 'desc' },
            });
            expect(result).toEqual([mockUser]);
        });
    });

    describe('updateStatus', () => {
        it('deve atualizar o status do usuário', async () => {
            const updatedUser = { ...mockUser, status: UserStatus.REJEITADO };
            database.client.user.update.mockResolvedValue(updatedUser);

            const result = await service.updateStatus(mockUser.id, UserStatus.REJEITADO);

            expect(database.client.user.update).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                data: { status: UserStatus.REJEITADO },
            });
            expect(result).toEqual(updatedUser);
        });
    });
});