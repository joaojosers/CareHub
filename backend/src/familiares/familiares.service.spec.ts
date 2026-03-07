import { FamiliaresService } from './familiares.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FamiliaresService', () => {
  let service: FamiliaresService;

  let databaseMock: any;

  beforeEach(() => {
    databaseMock = {
      client: {
        paciente: {
          findUnique: jest.fn(),
        },
        familiarVinculo: {
          findUnique: jest.fn(),
          create: jest.fn(),
          findMany: jest.fn(),
        },
      },
    };

    service = new FamiliaresService(databaseMock);
  });

  describe('vincularPaciente', () => {

    it('should throw NotFoundException if paciente does not exist', async () => {
      databaseMock.client.paciente.findUnique.mockResolvedValue(null);

      await expect(
        service.vincularPaciente('1', { pacienteId: 10 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if vínculo already exists', async () => {
      databaseMock.client.paciente.findUnique.mockResolvedValue({ id: 10 });

      databaseMock.client.familiarVinculo.findUnique.mockResolvedValue({ id: 1 });

      await expect(
        service.vincularPaciente('1', { pacienteId: 10 } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create vínculo successfully', async () => {
      const dto = {
        pacienteId: 10,
        parentesco: 'Filho',
        isResponsavelFinanceiro: true,
      };

      databaseMock.client.paciente.findUnique.mockResolvedValue({ id: 10 });
      databaseMock.client.familiarVinculo.findUnique.mockResolvedValue(null);

      const created = { id: 99 };
      databaseMock.client.familiarVinculo.create.mockResolvedValue(created);

      const result = await service.vincularPaciente('1', dto as any);

      expect(databaseMock.client.familiarVinculo.create)
        .toHaveBeenCalledWith({
          data: {
            userId: '1',
            pacienteId: 10,
            parentesco: 'Filho',
            isResponsavelFinanceiro: true,
          },
          include: {
            paciente: true,
          },
        });

      expect(result).toBe(created);
    });

    it('should default isResponsavelFinanceiro to false', async () => {
      const dto = {
        pacienteId: 10,
        parentesco: 'Filho',
      };

      databaseMock.client.paciente.findUnique.mockResolvedValue({ id: 10 });
      databaseMock.client.familiarVinculo.findUnique.mockResolvedValue(null);
      databaseMock.client.familiarVinculo.create.mockResolvedValue({});

      await service.vincularPaciente('1', dto as any);

      expect(databaseMock.client.familiarVinculo.create)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              isResponsavelFinanceiro: false,
            }),
          }),
        );
    });
  });

  describe('findMeusPacientes', () => {
    it('should return familiar vínculos', async () => {
      const expected = [{ id: 1 }, { id: 2 }];

      databaseMock.client.familiarVinculo.findMany.mockResolvedValue(expected);

      const result = await service.findMeusPacientes('1');

      expect(databaseMock.client.familiarVinculo.findMany)
        .toHaveBeenCalledWith({
          where: { userId: '1' },
          include: { paciente: true },
        });

      expect(result).toBe(expected);
    });
  });
});