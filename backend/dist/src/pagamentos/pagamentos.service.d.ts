import { DatabaseService } from '../database/database.service';
import { PagamentoStatus } from '@prisma/client';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { ConfirmarPagamentoDto } from './dto/confirmar-pagamento.dto';
export declare class PagamentosService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    create(dto: CreatePagamentoDto): Promise<any>;
    findAll(mes?: string, status?: PagamentoStatus, cuidadorId?: string): Promise<any[]>;
    findMy(cuidadorId: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    marcarComoProcessado(id: string): Promise<any>;
    confirmarPagamento(id: string, dto: ConfirmarPagamentoDto): Promise<any>;
    gerarRelatorio(mes: string): Promise<any>;
    delete(id: string): Promise<any>;
}
