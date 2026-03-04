import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as QRCode from 'qrcode';

export enum StatusPagamento {
  Pendente = 'Pendente',
  Concluido = 'Concluido',
  Cancelado = 'Cancelado',
}

@Injectable()
export class PagamentosService {
  constructor(private readonly db: DatabaseService) {}

  async gerarPix(cuidadorId: string, valor: number) {
    const cuidador = await this.db.client.cuidadorDetalhes.findUnique({
      where: { id: cuidadorId },
      include: { user: true },
    });

    if (!cuidador) {
      throw new NotFoundException('Cuidador não encontrado');
    }

    const dadosBancarios = cuidador.dadosBancarios as {
      banco?: string;
      agencia?: string;
      conta?: string;
      chavePix?: string;
    };

    if (!dadosBancarios?.chavePix) {
      throw new NotFoundException('Chave Pix não encontrada para este cuidador');
    }

    // Payload Pix simplificado (ideal usar uma lib específica para Pix)
    const payloadPix = `00020126580014BR.GOV.BCB.PIX0136${dadosBancarios.chavePix}5204000053039865406${valor.toFixed(
      2,
    )}5802BR5913${cuidador.user.nome}6009RIO DE JANEIRO62070503***6304ABCD`;

    const qrCodeBase64 = await QRCode.toDataURL(payloadPix);

    const pagamento = await this.db.client.pagamento.create({
      data: {
        cuidadorId: cuidador.id,
        valor,
        status: StatusPagamento.Pendente,
        payload: payloadPix,
      },
    });

    return {
      qr_code: qrCodeBase64,
      payload: payloadPix,
      cuidador: {
        id: cuidador.id,
        nome: cuidador.user.nome,
      },
      pagamentoId: pagamento.id,
    };
  }

  async listarPagamentos() {
    return this.db.client.pagamento.findMany({
      include: {
        cuidador: { include: { user: true } },
      },
    });
  }

  async buscarPagamentoPorId(id: number) {
    const pagamento = await this.db.client.pagamento.findUnique({
      where: { id },
      include: {
        cuidador: { include: { user: true } },
      },
    });

    if (!pagamento) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return pagamento;
  }

  async atualizarStatus(id: number, status: StatusPagamento) {
    return this.db.client.pagamento.update({
      where: { id },
      data: { status },
    });
  }
}
