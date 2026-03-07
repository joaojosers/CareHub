import { Test, TestingModule } from '@nestjs/testing';
import { PagamentosService } from './pagamentos.service';
import { DatabaseService } from '../database/database.service';
import { MercadoPagoService } from '../mercado-pago/mercado-pago.service';
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { MetodoPagamento, PagamentoStatus, Prisma } from '@prisma/client';

// ─── Mock DatabaseService ─────────────────────────────────────────────────────

const mockDb = {
    client: {
        plantao: { findUnique: jest.fn() },
        pagamento: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
};

// Mock MercadoPagoService — prevents real HTTP calls to MP API in unit tests
const mockMercadoPago = {
    criarPagamentoPix: jest.fn().mockResolvedValue({
        mpPaymentId: 'mp-test-123',
        qrCode: 'qr-code-string',
        qrCodeBase64: 'base64-string',
        ticketUrl: 'https://mp.com/ticket',
        expirationDate: new Date().toISOString(),
    }),
    validateWebhookSignature: jest.fn().mockReturnValue(true),
    consultarPagamento: jest.fn().mockResolvedValue('approved'),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makePlantao = (overrides = {}) => ({
    id: 'plantao-uuid',
    pacienteId: 'paciente-uuid',
    cuidadorId: 'cuidador-uuid',
    horasTrabalhadas: 8,
    status: 'APROVADO',
    cuidador: {
        id: 'cuidador-uuid',
        valorHora: new Prisma.Decimal(20), // R$20/hour
    },
    ...overrides,
});

const makePagamento = (overrides = {}) => ({
    id: 'pagamento-uuid',
    plantaoId: 'plantao-uuid',
    cuidadorId: 'cuidador-uuid',
    valorBruto: new Prisma.Decimal(160),    // 8h × R$20
    taxaPlataforma: new Prisma.Decimal(16), // 10% of 160
    valorLiquido: new Prisma.Decimal(144),  // 160 - 16
    status: PagamentoStatus.PENDENTE,
    metodoPagamento: MetodoPagamento.PIX,
    dataPagamento: null,
    numeroComprovante: null,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
    ...overrides,
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('PagamentosService', () => {
    let service: PagamentosService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PagamentosService,
                { provide: DatabaseService, useValue: mockDb },
                { provide: MercadoPagoService, useValue: mockMercadoPago },
            ],
        }).compile();

        service = module.get<PagamentosService>(PagamentosService);
        jest.clearAllMocks();
        // Re-apply default mock after clearAllMocks
        mockMercadoPago.criarPagamentoPix.mockResolvedValue({
            mpPaymentId: 'mp-test-123',
            qrCode: 'qr-code-string',
            qrCodeBase64: 'base64-string',
            ticketUrl: 'https://mp.com/ticket',
            expirationDate: new Date().toISOString(),
        });
    });

    // ── create() ─────────────────────────────────────────────────────────────

    describe('create()', () => {
        const dto = { plantaoId: 'plantao-uuid', metodoPagamento: MetodoPagamento.PIX };

        it('should throw NotFoundException when plantao does not exist', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException when plantao status is not APROVADO', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(
                makePlantao({ status: 'PENDENTE' }),
            );

            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException when plantao has no cuidador assigned', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(
                makePlantao({ cuidadorId: null, cuidador: null }),
            );

            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException when payment already exists for this shift', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.pagamento.findUnique.mockResolvedValue(makePagamento());

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });

        it('should calculate valorBruto = horasTrabalhadas × valorHora (8h × R$20 = R$160)', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.pagamento.findUnique.mockResolvedValue(null);
            mockDb.client.pagamento.create.mockResolvedValue(makePagamento());

            await service.create(dto);

            const { valorBruto } = mockDb.client.pagamento.create.mock.calls[0][0].data;
            expect(Number(valorBruto)).toBe(160);
        });

        it('should calculate taxaPlataforma = 10% of valorBruto (10% of R$160 = R$16)', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.pagamento.findUnique.mockResolvedValue(null);
            mockDb.client.pagamento.create.mockResolvedValue(makePagamento());

            await service.create(dto);

            const { taxaPlataforma } = mockDb.client.pagamento.create.mock.calls[0][0].data;
            expect(Number(taxaPlataforma)).toBe(16);
        });

        it('should calculate valorLiquido = valorBruto - taxaPlataforma (R$160 - R$16 = R$144)', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.pagamento.findUnique.mockResolvedValue(null);
            mockDb.client.pagamento.create.mockResolvedValue(makePagamento());

            await service.create(dto);

            const { valorLiquido } = mockDb.client.pagamento.create.mock.calls[0][0].data;
            expect(Number(valorLiquido)).toBe(144);
        });

        it('should create payment with status PENDENTE by default', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.pagamento.findUnique.mockResolvedValue(null);
            mockDb.client.pagamento.create.mockResolvedValue(makePagamento());

            await service.create(dto);

            const { status } = mockDb.client.pagamento.create.mock.calls[0][0].data;
            expect(status).toBe(PagamentoStatus.PENDENTE);
        });
    });

    // ── marcarComoProcessado() ────────────────────────────────────────────────

    describe('marcarComoProcessado()', () => {
        it('should throw NotFoundException when pagamento does not exist', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(null);

            await expect(service.marcarComoProcessado('invalid-uuid')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw BadRequestException when pagamento is not PENDENTE', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(
                makePagamento({ status: PagamentoStatus.PROCESSADO }),
            );

            await expect(service.marcarComoProcessado('pagamento-uuid')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should transition status PENDENTE → PROCESSADO', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(makePagamento());
            mockDb.client.pagamento.update.mockResolvedValue(
                makePagamento({ status: PagamentoStatus.PROCESSADO }),
            );

            const result = await service.marcarComoProcessado('pagamento-uuid');

            expect(mockDb.client.pagamento.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ status: PagamentoStatus.PROCESSADO }),
                }),
            );
            expect(result.status).toBe(PagamentoStatus.PROCESSADO);
        });
    });

    // ── confirmarPagamento() ──────────────────────────────────────────────────

    describe('confirmarPagamento()', () => {
        const confirmDto = { numeroComprovante: 'REC-2026-001' };

        it('should throw BadRequestException when pagamento is not PROCESSADO', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(
                makePagamento({ status: PagamentoStatus.PENDENTE }),
            );

            await expect(
                service.confirmarPagamento('pagamento-uuid', confirmDto),
            ).rejects.toThrow(BadRequestException);
        });

        it('should transition status PROCESSADO → PAID and save proof', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(
                makePagamento({ status: PagamentoStatus.PROCESSADO }),
            );
            mockDb.client.pagamento.update.mockResolvedValue(
                makePagamento({ status: PagamentoStatus.PAID, numeroComprovante: 'REC-2026-001' }),
            );

            const result = await service.confirmarPagamento('pagamento-uuid', confirmDto);

            expect(mockDb.client.pagamento.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        status: PagamentoStatus.PAID,
                        numeroComprovante: 'REC-2026-001',
                    }),
                }),
            );
            expect(result.status).toBe(PagamentoStatus.PAID);
        });
    });

    // ── findById() ────────────────────────────────────────────────────────────

    describe('findById()', () => {
        it('should throw NotFoundException when pagamento does not exist', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(null);

            await expect(service.findById('unknown-uuid')).rejects.toThrow(NotFoundException);
        });

        it('should return the pagamento when it exists', async () => {
            mockDb.client.pagamento.findUnique.mockResolvedValue(makePagamento());

            const result = await service.findById('pagamento-uuid');

            expect(result.id).toBe('pagamento-uuid');
        });
    });
});
