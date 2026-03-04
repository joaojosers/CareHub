import { FamiliaresController } from './familiares.controller';
import { FamiliaresService } from './familiares.service';

describe('FamiliaresController', () => {
  let controller: FamiliaresController;
  let service: {
    vincularPaciente: jest.Mock;
    findMeusPacientes: jest.Mock;
  };

  beforeEach(() => {
    service = {
      vincularPaciente: jest.fn(),
      findMeusPacientes: jest.fn(),
    };

    controller = new FamiliaresController(service as any);
  });

  describe('vincular', () => {
    it('should call service.vincularPaciente with userId and dto', async () => {
      const req = { user: { userId: 10 } };
      const dto = { pacienteId: 5 };

      const expected = { success: true };
      service.vincularPaciente.mockResolvedValue(expected);

      const result = await controller.vincular(req as any, dto as any);

      expect(service.vincularPaciente)
        .toHaveBeenCalledWith(10, dto);

      expect(result).toBe(expected);
    });
  });

  describe('getMeusPacientes', () => {
    it('should call service.findMeusPacientes with userId', async () => {
      const req = { user: { userId: 7 } };
      const expected = [{ id: 1 }, { id: 2 }];

      service.findMeusPacientes.mockResolvedValue(expected);

      const result = await controller.getMeusPacientes(req as any);

      expect(service.findMeusPacientes)
        .toHaveBeenCalledWith(7);

      expect(result).toBe(expected);
    });
  });
});