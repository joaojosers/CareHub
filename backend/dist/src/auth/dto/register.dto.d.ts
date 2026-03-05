import { UserRole } from '@prisma/client';
import { UserStatus } from '@prisma/client';
export declare class RegisterDto {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone?: string;
    tipo: UserRole;
    status?: UserStatus;
}
