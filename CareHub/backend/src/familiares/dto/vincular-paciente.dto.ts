import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class VincularPacienteDto {
    @IsUUID('4', { message: 'ID do paciente inválido' })
    @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
    pacienteId: string;

    @IsString()
    @IsNotEmpty({ message: 'O grau de parentesco é obrigatório (ex: Filho, Cônjuge)' })
    parentesco: string;

    @IsBoolean()
    @IsOptional()
    isResponsavelFinanceiro?: boolean;
}
