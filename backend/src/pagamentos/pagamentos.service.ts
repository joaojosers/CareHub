import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as QRCode from 'qrcode';

@Injectable()
export class PagamentosService {
  constructor(private readonly db: DatabaseService) {}

  async gerarPix(cuidadorId: string) {
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
    };

    const payloadPix = `00020126580014BR.GOV.BCB.PIX0136${dadosBancarios?.conta ?? ''}5204000053039865406100.005802BR5913${cuidador.user.nome}6009RIO DE JANEIRO62070503***6304ABCD`;

    const qrCodeBase64 = await QRCode.toDataURL(payloadPix);

    const pagamento = await this.db.client.pagamento.create({
      data: {
        cuidadorId: cuidador.id,
        valor: 100.0,
        status: 'Pendente',
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

  async atualizarStatus(id: number, status: string) {
    return this.db.client.pagamento.update({
      where: { id },
      data: { status },
    });
  }
}
