import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePacienteDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome do paciente é obrigatório' })
    nome: string;

    @IsDateString({}, { message: 'A data de nascimento deve estar no formato ISO (AAAA-MM-DD)' })
    @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
    dataNascimento: string;

    @IsString()
    @IsOptional()
    necessidades?: string;
}
