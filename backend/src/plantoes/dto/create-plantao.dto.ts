import { IsNotEmpty, IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePlantaoDto {
    @IsUUID('4', { message: 'ID do paciente inválido' })
    @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
    pacienteId: string;

    @IsUUID('4', { message: 'ID do cuidador inválido' })
    @IsOptional()
    cuidadorId?: string;

    @IsISO8601({}, { message: 'A data de início deve estar no formato ISO (AAAA-MM-DDTHH:mm:ss)' })
    @IsNotEmpty({ message: 'A data de início é obrigatória' })
    dataInicio: string;

    @IsISO8601({}, { message: 'A data de fim deve estar no formato ISO (AAAA-MM-DDTHH:mm:ss)' })
    @IsNotEmpty({ message: 'A data de fim é obrigatória' })
    dataFim: string;

    @IsString()
    @IsOptional()
    relatorio?: string;
}
