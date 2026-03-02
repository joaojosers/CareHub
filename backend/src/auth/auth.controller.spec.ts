import { AuthController } from './auth.controller';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
    let authServiceMock: {
        register: jest.Mock;
        validateUser: jest.Mock;
        login: jest.Mock;
    };
    let controller: AuthController;

    beforeEach(() => {
        authServiceMock = {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
        };
        controller = new AuthController(authServiceMock as any);
    });

    it('should call authService.register and return its result', async () => {
        const registerDto = { nome: 'Fulano', email: 'f@example.com', senha: 'password' };
        const expected = { id: 1, email: 'f@example.com' };
        authServiceMock.register.mockResolvedValue(expected);

        const result = await controller.register(registerDto as any);

        expect(authServiceMock.register).toHaveBeenCalledWith(registerDto);
        expect(result).toBe(expected);
    });

    it('should validate user and call authService.login on successful login', async () => {
        const loginDto = { email: 'u@example.com', senha: 'secret' };
        const user = { id: 2, email: 'u@example.com' };
        const tokenResponse = { access_token: 'jwt-token' };

        authServiceMock.validateUser.mockResolvedValue(user);
        authServiceMock.login.mockResolvedValue(tokenResponse);

        const result = await controller.login(loginDto as any);

        expect(authServiceMock.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.senha);
        expect(authServiceMock.login).toHaveBeenCalledWith(user);
        expect(result).toBe(tokenResponse);
    });

    it('should throw UnauthorizedException when validateUser returns falsy', async () => {
        const loginDto = { email: 'bad@example.com', senha: 'wrong' };
        authServiceMock.validateUser.mockResolvedValue(null);

        await expect(controller.login(loginDto as any)).rejects.toThrow(UnauthorizedException);
        await expect(controller.login(loginDto as any)).rejects.toThrow('E-mail ou senha incorretos');

        expect(authServiceMock.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.senha);
        expect(authServiceMock.login).not.toHaveBeenCalled();
    });
});