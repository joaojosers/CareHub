import { IsNotEmpty, IsISO8601, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RelatorioDto } from './relatorio.dto';

export class CreatePlantaoDto {
    @ApiProperty({ description: 'ID do paciente', example: 'uuid-do-paciente' })
    @IsUUID('4', { message: 'ID do paciente inválido' })
    @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
    pacienteId: string;

    @ApiPropertyOptional({ description: 'ID do cuidador (opcional na criação)', example: 'uuid-do-cuidador' })
    @IsUUID('4', { message: 'ID do cuidador inválido' })
    @IsOptional()
    cuidadorId?: string;

    @ApiProperty({ description: 'Data e hora de início (ISO 8601)', example: '2026-06-01T08:00:00Z' })
    @IsISO8601({}, { message: 'A data de início deve estar no formato ISO (AAAA-MM-DDTHH:mm:ss)' })
    @IsNotEmpty({ message: 'A data de início é obrigatória' })
    dataInicio: string;

    @ApiProperty({ description: 'Data e hora de fim (ISO 8601)', example: '2026-06-01T20:00:00Z' })
    @IsISO8601({}, { message: 'A data de fim deve estar no formato ISO (AAAA-MM-DDTHH:mm:ss)' })
    @IsNotEmpty({ message: 'A data de fim é obrigatória' })
    dataFim: string;

    @ApiPropertyOptional({ type: RelatorioDto, description: 'Relatório estruturado do plantão' })
    @IsOptional()
    @ValidateNested()
    @Type(() => RelatorioDto)
    relatorio?: RelatorioDto;
}

