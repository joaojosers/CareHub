import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalcularMesDto {
  @ApiProperty({
    description: 'Mês para cálculo de pagamentos (formato YYYY-MM)',
    example: '2026-02',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'O mês deve estar no formato YYYY-MM',
  })
  mes: string;

  @ApiProperty({
    description: 'ID do cuidador (opcional - se não informado, calcula para todos)',
    example: 'uuid-aqui',
    required: false,
  })
  @IsOptional()
  @IsString()
  cuidadorId?: string;
}
