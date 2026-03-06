import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class VincularPacienteDto {
  @ApiProperty({
    description: 'UUID do paciente que será vinculado',
    example: '5c41d066-0fd8-4959-919c-c02ffd5fbe02'
  })
  @IsUUID('4', { message: 'ID do paciente inválido' })
  @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
  pacienteId: string;

  @ApiProperty({
    description: 'UUID do usuário (familiar) que será vinculado',
    example: '0d85a3dd-289c-474c-84e6-a95ba1939bc3'
  })
  @IsUUID('4', { message: 'ID do usuário inválido' }) // 👈 Adicionado!
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  userId: string;

  @ApiProperty({
    description: 'Grau de parentesco entre o familiar e o paciente',
    example: 'Filho(a)'
  })
  @IsString()
  @IsNotEmpty({ message: 'O grau de parentesco é obrigatório (ex: Filho, Cônjuge)' })
  parentesco: string;

  @ApiProperty({
    description: 'Define se este familiar é o responsável pelo pagamento',
    default: false,
    required: false
  })
  @IsBoolean({ message: 'O campo responsável financeiro deve ser um booleano' })
  @IsOptional()
  isResponsavelFinanceiro?: boolean;
}
