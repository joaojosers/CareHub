import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { ConfirmarPagamentoDto } from './dto/confirmar-pagamento.dto';
import { PagamentoStatus } from '@prisma/client';
export declare class PagamentosController {
    private readonly pagamentosService;
    constructor(pagamentosService: PagamentosService);
    create(dto: CreatePagamentoDto): Promise<any>;
    findAll(mes?: string, status?: PagamentoStatus, cuidadorId?: string): Promise<any[]>;
    gerarRelatorio(mes: string): Promise<any>;
    findById(id: string): Promise<any>;
    marcarComoProcessado(id: string): Promise<any>;
    confirmarPagamento(id: string, dto: ConfirmarPagamentoDto): Promise<any>;
    delete(id: string): Promise<any>;
    findMy(req: any): Promise<any[]>;
}
