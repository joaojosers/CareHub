import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnderecoDto {
    @ApiProperty({ example: 'Rua das Flores' })
    @IsString()
    @IsNotEmpty()
    logradouro: string;

    @ApiProperty({ example: '123' })
    @IsString()
    @IsNotEmpty()
    numero: string;

    @ApiPropertyOptional({ example: 'Apto 45' })
    @IsString()
    @IsOptional()
    complemento?: string;

    @ApiProperty({ example: 'Centro' })
    @IsString()
    @IsNotEmpty()
    bairro: string;

    @ApiProperty({ example: 'São Paulo' })
    @IsString()
    @IsNotEmpty()
    cidade: string;

    @ApiProperty({ example: 'SP' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2)
    estado: string;

    @ApiProperty({ example: '01234567' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(8)
    cep: string;

    @ApiPropertyOptional({ example: 'Próximo ao mercado' })
    @IsString()
    @IsOptional()
    referencia?: string;
}
