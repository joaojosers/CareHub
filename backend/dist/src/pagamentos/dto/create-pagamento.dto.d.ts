import { MetodoPagamento } from '@prisma/client';
export declare class CreatePagamentoDto {
    plantaoId: string;
    metodoPagamento?: MetodoPagamento;
}
