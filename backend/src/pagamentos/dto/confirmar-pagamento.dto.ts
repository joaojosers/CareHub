import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmarPagamentoDto {
  @ApiProperty({
    description: 'Número do comprovante de pagamento',
    example: 'TRF-2026-02-001',
  })
  @IsString()
  @IsNotEmpty({ message: 'O número do comprovante é obrigatório' })
  numeroComprovante: string;

  @ApiProperty({
    description: 'Data do pagamento (opcional)',
    example: '2026-02-18T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  dataPagamento?: string;
}
