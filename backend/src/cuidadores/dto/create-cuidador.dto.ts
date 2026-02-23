import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnderecoDto } from '../../common/dto/endereco.dto';
import { DocumentoDto } from './documento.dto';

export class CreateCuidadorDto {
    @ApiProperty({ description: 'Nome completo do cuidador', example: 'Ana Maria Ferreira' })
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;

    @ApiProperty({ description: 'E-mail para login', example: 'ana.ferreira@email.com' })
    @IsEmail({}, { message: 'E-mail inválido' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    email: string;

    @ApiProperty({ description: 'Senha de acesso', example: 'SenhaSegura123', minLength: 6 })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    senha: string;

    @ApiProperty({ description: 'CPF do cuidador (sem pontuação)', example: '12345678900' })
    @IsString()
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    cpf: string;

    @ApiPropertyOptional({ description: 'Telefone de contato', example: '11999999999' })
    @IsOptional()
    @IsString()
    telefone?: string;

    @ApiPropertyOptional({ description: 'Lista de especialidades', example: ['Enfermagem', 'Cuidados Paliativos'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    especialidades?: string[];

    @ApiPropertyOptional({ description: 'Dados bancários (JSON)', example: { banco: 'Nubank', agencia: '0001', conta: '123456-7' } })
    @IsOptional()
    dadosBancarios?: any;

    @ApiPropertyOptional({ type: [DocumentoDto], description: 'Documentos do cuidador' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DocumentoDto)
    documentos?: DocumentoDto[];

    @ApiPropertyOptional({ type: EnderecoDto, description: 'Endereço do cuidador' })
    @IsOptional()
    @ValidateNested()
    @Type(() => EnderecoDto)
    endereco?: EnderecoDto;
}

