import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto): Promise<{
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
