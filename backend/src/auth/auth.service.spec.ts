import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';

// ─── Mock bcrypt at module level (avoids "Cannot redefine property" error) ───
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt');

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeUser = (overrides: Record<string, unknown> = {}) => ({
    id: 'user-uuid-1',
    nome: 'João Silva',
    email: 'joao@test.com',
    senha: 'hashed-password',
    cpf: '12345678901',
    tipo: UserRole.CUIDADOR,
    status: UserStatus.APROVADO,
    telefone: null as string | null,
    dataCadastro: new Date(),
    ...overrides,
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    // ── validateUser ──────────────────────────────────────────────────────────

    describe('validateUser()', () => {
        it('should return user data (without senha) for valid APROVADO credentials', async () => {
            const user = makeUser();
            mockUsersService.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);

            const result = await service.validateUser('joao@test.com', 'password123');

            expect(result).toBeDefined();
            expect(result.email).toBe('joao@test.com');
            expect(result).not.toHaveProperty('senha'); // password MUST NOT be returned
        });

        it('should throw UnauthorizedException for a PENDENTE user even with correct password', async () => {
            mockUsersService.findByEmail.mockResolvedValue({
                id: '2',
                email: 'test@test.com',
                senha: 'hashed_password',
                status: UserStatus.PENDENTE,
            });

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            await expect(service.validateUser('test@test.com', 'test123')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for a REJEITADO user', async () => {
            mockUsersService.findByEmail.mockResolvedValue({
                id: '3',
                email: 'test@test.com',
                senha: 'hashed_password',
                status: UserStatus.REJEITADO,
            });

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            await expect(service.validateUser('test@test.com', 'test123')).rejects.toThrow(UnauthorizedException);
        });
        it('should return null when the password is wrong', async () => {
            const user = makeUser();
            mockUsersService.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            const result = await service.validateUser('joao@test.com', 'wrong-password');

            expect(result).toBeNull();
        });

        it('should return null when the user does not exist', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);

            const result = await service.validateUser('unknown@test.com', 'password');

            expect(result).toBeNull();
        });
    });

    // ── register ──────────────────────────────────────────────────────────────

    describe('register()', () => {
        const registerDto = {
            nome: 'Maria Souza',
            email: 'maria@test.com',
            senha: 'secret123',
            cpf: '98765432100',
            tipo: UserRole.FAMILIAR,
        };

        it('should successfully register a new FAMILIAR user with status PENDENTE', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue({
                id: 'new-uuid',
                nome: registerDto.nome,
                email: registerDto.email,
                cpf: registerDto.cpf,
                tipo: registerDto.tipo,
                senha: 'hashed-secret',
                status: UserStatus.PENDENTE,
                dataCadastro: new Date(),
                telefone: null,
            });

            const result = await service.register(registerDto);

            expect(result.email).toBe('maria@test.com');
            expect(result).not.toHaveProperty('senha'); // password MUST NOT be returned
            expect(mockUsersService.create).toHaveBeenCalledWith(
                expect.objectContaining({ status: UserStatus.PENDENTE }),
            );
        });

        it('should throw ConflictException when email is already in use', async () => {
            mockUsersService.findByEmail.mockResolvedValue(makeUser());

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when trying to register as ADMIN', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);

            const adminDto = { ...registerDto, tipo: UserRole.ADMIN };

            await expect(service.register(adminDto)).rejects.toThrow(BadRequestException);
            expect(mockUsersService.create).not.toHaveBeenCalled();
        });
    });

    // ── login ─────────────────────────────────────────────────────────────────

    describe('login()', () => {
        it('should return a signed JWT access_token and user summary', async () => {
            const user = makeUser();

            const result = await service.login(user);

            expect(result.access_token).toBe('mock-jwt-token');
            expect(result.user.id).toBe('user-uuid-1');
            expect(result.user.email).toBe('joao@test.com');
            expect(result.user.tipo).toBe(UserRole.CUIDADOR);
            expect(result.user).not.toHaveProperty('senha');
            expect(mockJwtService.sign).toHaveBeenCalledWith(
                expect.objectContaining({ email: 'joao@test.com' }),
            );
        });
    });
});
