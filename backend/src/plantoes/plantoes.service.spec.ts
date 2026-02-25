import { Test, TestingModule } from '@nestjs/testing';
import { PlantoesService } from './plantoes.service';
import { DatabaseService } from '../database/database.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlantaoStatus } from '@prisma/client';

// ─── Mock DatabaseService ────────────────────────────────────────────────────

const mockDb = {
    client: {
        paciente: { findUnique: jest.fn() },
        cuidadorDetalhes: { findUnique: jest.fn() },
        plantao: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        familiarVinculo: { findMany: jest.fn() },
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns ISO strings offset by `hours` hours from now */
const makeDates = (hours: number) => {
    const inicio = new Date('2026-03-01T08:00:00Z');
    const fim = new Date(inicio.getTime() + hours * 60 * 60 * 1000);
    return { dataInicio: inicio.toISOString(), dataFim: fim.toISOString() };
};

const makePaciente = () => ({ id: 'paciente-uuid', nome: 'Ana Lima' });
const makeCuidador = (id = 'cuidador-uuid') => ({ id, userId: 'user-uuid' });
const makePlantao = (overrides = {}) => ({
    id: 'plantao-uuid',
    pacienteId: 'paciente-uuid',
    cuidadorId: 'cuidador-uuid',
    dataInicio: new Date('2026-03-01T08:00:00Z'),
    dataFim: new Date('2026-03-01T16:00:00Z'),
    horasTrabalhadas: 8,
    status: PlantaoStatus.PENDENTE,
    relatorioAtividade: null,
    ...overrides,
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('PlantoesService', () => {
    let service: PlantoesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlantoesService,
                { provide: DatabaseService, useValue: mockDb },
            ],
        }).compile();

        service = module.get<PlantoesService>(PlantoesService);
        jest.clearAllMocks();
    });

    // ── create() ─────────────────────────────────────────────────────────────

    describe('create()', () => {
        it('should throw BadRequestException when dataFim <= dataInicio', async () => {
            const dto = {
                pacienteId: 'paciente-uuid',
                dataInicio: '2026-03-01T10:00:00Z',
                dataFim: '2026-03-01T08:00:00Z', // BEFORE inicio
            };

            await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
            expect(mockDb.client.plantao.create).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException when dataFim equals dataInicio', async () => {
            const dto = {
                pacienteId: 'paciente-uuid',
                dataInicio: '2026-03-01T08:00:00Z',
                dataFim: '2026-03-01T08:00:00Z', // EQUAL
            };

            await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when paciente does not exist', async () => {
            mockDb.client.paciente.findUnique.mockResolvedValue(null);

            const dto = { pacienteId: 'invalid-uuid', ...makeDates(8) };

            await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException when cuidadorId is invalid', async () => {
            mockDb.client.paciente.findUnique.mockResolvedValue(makePaciente());
            mockDb.client.cuidadorDetalhes.findUnique.mockResolvedValue(null); // not found by userId or id

            const dto = { pacienteId: 'paciente-uuid', cuidadorId: 'bad-uuid', ...makeDates(8) };

            await expect(service.create(dto as any)).rejects.toThrow(NotFoundException);
        });

        it('should calculate horasTrabalhadas correctly (8-hour shift)', async () => {
            mockDb.client.paciente.findUnique.mockResolvedValue(makePaciente());
            mockDb.client.plantao.create.mockResolvedValue(makePlantao());

            const dto = { pacienteId: 'paciente-uuid', ...makeDates(8) };
            await service.create(dto as any);

            expect(mockDb.client.plantao.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ horasTrabalhadas: 8 }),
                }),
            );
        });

        it('should calculate horasTrabalhadas correctly (6-hour shift)', async () => {
            mockDb.client.paciente.findUnique.mockResolvedValue(makePaciente());
            mockDb.client.plantao.create.mockResolvedValue(makePlantao({ horasTrabalhadas: 6 }));

            const dto = { pacienteId: 'paciente-uuid', ...makeDates(6) };
            await service.create(dto as any);

            expect(mockDb.client.plantao.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ horasTrabalhadas: 6 }),
                }),
            );
        });

        it('should create plantao with status PENDENTE by default', async () => {
            mockDb.client.paciente.findUnique.mockResolvedValue(makePaciente());
            mockDb.client.plantao.create.mockResolvedValue(makePlantao());

            const dto = { pacienteId: 'paciente-uuid', ...makeDates(8) };
            await service.create(dto as any);

            expect(mockDb.client.plantao.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ status: PlantaoStatus.PENDENTE }),
                }),
            );
        });

        it('should create plantao without cuidador (open shift)', async () => {
            mockDb.client.paciente.findUnique.mockResolvedValue(makePaciente());
            mockDb.client.plantao.create.mockResolvedValue(makePlantao({ cuidadorId: null }));

            const dto = { pacienteId: 'paciente-uuid', ...makeDates(8) }; // no cuidadorId
            await service.create(dto as any);

            expect(mockDb.client.plantao.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ cuidadorId: null }),
                }),
            );
        });
    });

    // ── updateStatus() ────────────────────────────────────────────────────────

    describe('updateStatus()', () => {
        it('should throw NotFoundException when plantao does not exist', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(null);

            await expect(
                service.updateStatus('invalid-uuid', PlantaoStatus.APROVADO),
            ).rejects.toThrow(NotFoundException);
        });

        it('should update plantao status to APROVADO', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.plantao.update.mockResolvedValue(
                makePlantao({ status: PlantaoStatus.APROVADO }),
            );

            const result = await service.updateStatus('plantao-uuid', PlantaoStatus.APROVADO);

            expect(mockDb.client.plantao.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { status: PlantaoStatus.APROVADO } }),
            );
            expect(result.status).toBe(PlantaoStatus.APROVADO);
        });

        it('should update plantao status to REJEITADO', async () => {
            mockDb.client.plantao.findUnique.mockResolvedValue(makePlantao());
            mockDb.client.plantao.update.mockResolvedValue(
                makePlantao({ status: PlantaoStatus.REJEITADO }),
            );

            const result = await service.updateStatus('plantao-uuid', PlantaoStatus.REJEITADO);

            expect(result.status).toBe(PlantaoStatus.REJEITADO);
        });
    });

    // ── findByCuidador() ──────────────────────────────────────────────────────

    describe('findByCuidador()', () => {
        it('should throw NotFoundException when cuidador profile does not exist', async () => {
            mockDb.client.cuidadorDetalhes.findUnique.mockResolvedValue(null);

            await expect(service.findByCuidador('unknown-user-id')).rejects.toThrow(NotFoundException);
        });

        it('should return shifts for a valid cuidador', async () => {
            mockDb.client.cuidadorDetalhes.findUnique.mockResolvedValue(makeCuidador());
            mockDb.client.plantao.findMany.mockResolvedValue([makePlantao()]);

            const result = await service.findByCuidador('user-uuid');

            expect(result).toHaveLength(1);
            expect(mockDb.client.plantao.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { cuidadorId: 'cuidador-uuid' },
                }),
            );
        });
    });
});
