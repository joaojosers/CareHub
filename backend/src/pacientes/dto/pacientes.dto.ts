import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsDateString, 
  ValidateNested, 
  IsUUID,     
  IsBoolean   
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnderecoDto } from '../../common/dto/endereco.dto';

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

    @ApiPropertyOptional({ type: EnderecoDto, description: 'Endereço do paciente' })
    @IsOptional()
    @ValidateNested()
    @Type(() => EnderecoDto)
    endereco?: EnderecoDto;

    @ApiProperty({ description: 'ID do usuário (familiar) já cadastrado', example: '0d85a3dd-289c-474c-84e6-a95ba1939bc3' })
    @IsUUID()
    @IsNotEmpty({ message: 'O ID do familiar é obrigatório para o vínculo' })
    familiarId: string;

    @ApiProperty({ description: 'Grau de parentesco', example: 'Filho(a)' })
    @IsString()
    @IsNotEmpty({ message: 'O parentesco é obrigatório' })
    parentesco: string;

    @ApiPropertyOptional({ description: 'Define se é o responsável financeiro', default: false })
    @IsBoolean()
    @IsOptional()
    isResponsavelFinanceiro?: boolean;
}

