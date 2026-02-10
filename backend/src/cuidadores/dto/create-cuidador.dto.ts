import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateCuidadorDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;

    @IsEmail({}, { message: 'E-mail inválido' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    senha: string;

    @IsString()
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    cpf: string;

    @IsOptional()
    @IsString()
    telefone?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    especialidades?: string[];

    @IsOptional()
    dadosBancarios?: any;

    @IsOptional()
    documentos?: any;
}
