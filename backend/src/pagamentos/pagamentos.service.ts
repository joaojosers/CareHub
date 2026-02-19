import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as QRCode from 'qrcode';

@Injectable()
export class PagamentosService {
  constructor(private readonly db: DatabaseService) {}

  async gerarPix(cuidadorId: string) {
    // Busca cuidador pelo modelo CuidadorDetalhes
    const cuidador = await this.db.cuidadorDetalhes.findUnique({
      where: { id: cuidadorId },
      include: { user: true }, // traz também os dados do usuário
    });

    if (!cuidador) {
      throw new NotFoundException('Cuidador não encontrado');
    }

    // Exemplo de payload Pix usando dados bancários e nome do usuário
    const payloadPix = `00020126580014BR.GOV.BCB.PIX0136${cuidador.dadosBancarios?.conta}5204000053039865406100.005802BR5913${cuidador.user.nome}6009RIO DE JANEIRO62070503***6304ABCD`;

    // Gera QR Code em base64
    const qrCodeBase64 = await QRCode.toDataURL(payloadPix);

    // Retorna para o frontend
    return {
      qr_code: qrCodeBase64,
      payload: payloadPix,
      cuidador: {
        id: cuidador.id,
        nome: cuidador.user.nome,
      },
    };
  }
}
