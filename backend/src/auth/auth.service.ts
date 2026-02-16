import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.senha))) {
            const { senha, ...result } = user;
            return result;
        }
        return null;
    }

    async register(registerDto: RegisterDto) {
        // Valida se email já existe
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('E-mail já está em uso.');
        }

        // Não permite criar ADMIN via auto-registro
        if (registerDto.tipo === UserRole.ADMIN) {
            throw new BadRequestException('Não é permitido criar usuários ADMIN via registro público.');
        }

        // Cria o usuário com status PENDENTE
        const newUser = await this.usersService.create({
            nome: registerDto.nome,
            email: registerDto.email,
            senha: registerDto.senha,
            cpf: registerDto.cpf,
            tipo: registerDto.tipo,
            status: UserStatus.PENDENTE,
        });

        const { senha, ...result } = newUser;
        return result;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.tipo };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo,
            },
        };
    }
}
