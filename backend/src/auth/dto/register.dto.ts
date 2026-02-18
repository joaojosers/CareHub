import { IsEmail, IsNotEmpty, MinLength, IsString, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ description: 'Nome completo do usuário', example: 'João da Silva' })
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;

    @ApiProperty({ description: 'E-mail para login', example: 'joao@email.com' })
    @IsEmail({}, { message: 'Por favor, insira um e-mail válido' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @ApiProperty({ description: 'Senha de acesso (mínimo 6 caracteres)', example: 'senha123', minLength: 6 })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    senha: string;

    @ApiProperty({ description: 'CPF do usuário', example: '123.456.789-00' })
    @IsString()
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    cpf: string;

    @ApiProperty({ description: 'Tipo de usuário (CUIDADOR ou FAMILIAR)', enum: UserRole, example: 'CUIDADOR' })
    @IsEnum(UserRole, { message: 'O tipo de usuário deve ser CUIDADOR ou FAMILIAR' })
    tipo: UserRole;
}
