import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetodoPagamento } from '@prisma/client';

export class CreatePagamentoDto {
    @ApiProperty({
        description: 'ID do plantão aprovado a ser pago',
        example: 'uuid-do-plantao',
    })
    @IsUUID()
    plantaoId: string;

    @ApiProperty({
        description: 'Método de pagamento',
        enum: MetodoPagamento,
        default: MetodoPagamento.PIX,
        required: false,
    })
    @IsOptional()
    @IsEnum(MetodoPagamento)
    metodoPagamento?: MetodoPagamento;
}
