import { Injectable, Logger } from '@nestjs/common';
import MercadoPago, { Payment } from 'mercadopago';

export interface PixPaymentResult {
    mpPaymentId: string;
    qrCode: string;
    qrCodeBase64: string;
    ticketUrl: string;
    expirationDate: string;
}

/**
 * MercadoPagoService
 *
 * Integrates with the Mercado Pago API (sandbox mode) to process
 * real Pix payments for caregivers.
 *
 * To switch to production:
 *  1. Replace MP_ACCESS_TOKEN with a production token (APP_USR-...)
 *  2. Set a publicly accessible webhook URL (POST /pagamentos/webhook)
 *  3. Configure MP_WEBHOOK_SECRET for signature validation
 */
@Injectable()
export class MercadoPagoService {
    private readonly logger = new Logger(MercadoPagoService.name);
    private readonly mp: MercadoPago;
    private readonly payment: Payment;

    constructor() {
        this.mp = new MercadoPago({
            accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000',
        });
        this.payment = new Payment(this.mp);
    }

    // ─── Create PIX payment ──────────────────────────────────────────────────

    async criarPagamentoPix(
        cuidadorId: string,
        nomeCuidador: string,
        emailCuidador: string,
        cpfCuidador: string,
        valorLiquido: number,
        pagamentoId: string,
    ): Promise<PixPaymentResult> {
        this.logger.log(`💳 Criando pagamento Pix para cuidador ${nomeCuidador} | Valor: R$${valorLiquido}`);

        try {
            const result = await this.payment.create({
                body: {
                    transaction_amount: valorLiquido,
                    description: `Pagamento CareHub — Plantão #${pagamentoId}`,
                    payment_method_id: 'pix',
                    payer: {
                        email: emailCuidador,
                        first_name: nomeCuidador.split(' ')[0],
                        last_name: nomeCuidador.split(' ').slice(1).join(' ') || 'CareHub',
                        identification: {
                            type: 'CPF',
                            number: cpfCuidador,
                        },
                    },
                    // External reference links the MP payment to our internal record
                    external_reference: pagamentoId,
                    // Pix expires in 30 minutes
                    date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                },
                requestOptions: {
                    idempotencyKey: pagamentoId, // Prevents duplicate charges on retry
                },
            });

            const pixData = result.point_of_interaction?.transaction_data;

            this.logger.log(`✅ Pagamento Pix criado: mpPaymentId=${result.id}`);

            return {
                mpPaymentId: String(result.id),
                qrCode: pixData?.qr_code || '',
                qrCodeBase64: pixData?.qr_code_base64 || '',
                ticketUrl: pixData?.ticket_url || '',
                expirationDate: result.date_of_expiration || '',
            };
        } catch (error) {
            this.logger.error(`❌ Falha ao criar pagamento MP: ${error.message}`);
            throw error; // Re-throw — caller decides how to handle
        }
    }

    // ─── Validate webhook signature ──────────────────────────────────────────

    /**
     * Validates the x-signature header from Mercado Pago webhooks.
     * In production: use the MP_WEBHOOK_SECRET to verify HMAC-SHA256.
     *
     * See: https://www.mercadopago.com.br/developers/en/docs/your-integrations/notifications/webhooks
     */
    validateWebhookSignature(
        xSignature: string,
        xRequestId: string,
        dataId: string,
    ): boolean {
        const secret = process.env.MP_WEBHOOK_SECRET;

        if (!secret) {
            this.logger.warn('⚠️  MP_WEBHOOK_SECRET not set — skipping signature validation (sandbox mode)');
            return true; // Allow in sandbox; enforce in production
        }

        try {
            const crypto = require('crypto');
            const manifest = `id:${dataId};request-id:${xRequestId};ts:${Date.now()};`;
            const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
            const parts = Object.fromEntries(xSignature.split(',').map(p => p.trim().split('=')));
            return parts.v1 === expected;
        } catch {
            return false;
        }
    }

    // ─── Query payment status ────────────────────────────────────────────────

    async consultarPagamento(mpPaymentId: string): Promise<string> {
        try {
            const result = await this.payment.get({ id: Number(mpPaymentId) });
            return result.status || 'unknown';
        } catch (error) {
            this.logger.error(`❌ Erro ao consultar MP payment ${mpPaymentId}: ${error.message}`);
            return 'error';
        }
    }
}
