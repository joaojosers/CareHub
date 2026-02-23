import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RelatorioDto {
    @ApiProperty({ example: 'Paciente passou bem o dia, alimentou-se corretamente.' })
    @IsString()
    @IsNotEmpty()
    descricao: string;

    @ApiPropertyOptional({ example: 'Losartana 50mg às 08:00' })
    @IsString()
    @IsOptional()
    medicacoes?: string;

    @ApiPropertyOptional({ example: '12/8' })
    @IsString()
    @IsOptional()
    pressaoArterial?: string;

    @ApiPropertyOptional({ example: 'Dormiu mais que o habitual na parte da tarde.' })
    @IsString()
    @IsOptional()
    observacoes?: string;
}
