import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePacienteDto {
    @ApiProperty({ description: 'Nome completo do paciente', example: 'Dona Maria de Oliveira' })
    @IsString()
    @IsNotEmpty({ message: 'O nome do paciente é obrigatório' })
    nome: string;

    @ApiProperty({ description: 'Data de nascimento (ISO 8601)', example: '1950-05-20T00:00:00Z' })
    @IsDateString({}, { message: 'A data de nascimento deve estar no formato ISO (AAAA-MM-DD)' })
    @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
    dataNascimento: string;

    @ApiPropertyOptional({ description: 'Detalhes sobre necessidades especiais e histórico', example: 'Paciente diabética, necessita de insulina.' })
    @IsString()
    @IsOptional()
    necessidades?: string;
}
