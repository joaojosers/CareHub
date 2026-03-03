import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
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
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    // 1. Verifica se o usuário existe e se a senha está correta
    if (user && (await bcrypt.compare(pass, user.senha))) {
      
      // 2. Bloqueia login de usuários que não estão APROVADOS
      // Lançamos uma exceção clara em vez de retornar null para o frontend saber o motivo
      if (user.status !== UserStatus.APROVADO) {
        throw new UnauthorizedException('Sua conta está pendente de aprovação pelo administrador.');
      }

      const { senha, ...result } = user;
      return result;
    }
    
    return null;
  }

  async register(registerDto: RegisterDto) {
    // 3. Valida duplicidade de e-mail
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('E-mail já está em uso.');
    }

    // 4. Segurança: Impede criação de ADMIN via rotas públicas
    if (registerDto.tipo === UserRole.ADMIN) {
      throw new BadRequestException('Não é permitido criar usuários ADMIN via registro público.');
    }

    /**
     * 5. Lógica de Status Dinâmico:
     * Se o DTO trouxer um status (enviado pelo Admin no Front), usamos ele.
     * Caso contrário (auto-registro), o padrão é PENDENTE.
     */
    const statusFinal = registerDto.status || UserStatus.PENDENTE;

    const newUser = await this.usersService.create({
      nome: registerDto.nome,
      email: registerDto.email,
      senha: registerDto.senha,
      cpf: registerDto.cpf,
      tipo: registerDto.tipo,
      status: statusFinal, // Agora aceita o que vier do Frontend
      telefone: registerDto.telefone, 
    });

    const { senha, ...result } = newUser;
    return result;
  }

  async login(user: any) {
    // 6. Payload do JWT agora inclui a ROLE para facilitar o controle no Frontend
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.tipo,
      status: user.status 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        status: user.status
      },
    };
    }
}
