import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        email: string;
        cpf: string;
        tipo: import("@prisma/client").$Enums.UserRole;
        nome: string;
        telefone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        dataCadastro: Date;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            nome: any;
            email: any;
            tipo: any;
            status: any;
        };
    }>;
}
