import { Test, TestingModule } from '@nestjs/testing';
import { PagamentosController } from './pagamentos.controller';
import { PagamentosService } from './pagamentos.service';
import { PagamentoStatus } from '@prisma/client';

// 1. Dublê do serviço contemplando todos os métodos do Controller
const mockPagamentosService = {
  create: jest.fn(),
  findAll: jest.fn(),
  gerarRelatorio: jest.fn(),
  findById: jest.fn(),
  marcarComoProcessado: jest.fn(),
  confirmarPagamento: jest.fn(),
  delete: jest.fn(),
  findMy: jest.fn(),
};

describe('PagamentosController', () => {
  let controller: PagamentosController;
  let service: typeof mockPagamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentosController],
      providers: [
        {
          provide: PagamentosService,
          useValue: mockPagamentosService,
        },
      ],
    }).compile();

    controller = module.get<PagamentosController>(PagamentosController);
    service = module.get(PagamentosService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar o serviço com o DTO e retornar o pagamento criado', async () => {
      const dto = { plantaoId: 'plantao-123', cuidadorId: 'cuidador-123' } as any;
      const resultMock = { id: 'pagamento-123', ...dto };
      
      service.create.mockResolvedValue(resultMock);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(resultMock);
    });
  });

  describe('findAll', () => {
    it('deve chamar o serviço repassando os parâmetros de query', async () => {
      const resultMock = [{ id: 'pagamento-123', valorBruto: 160.0 }];
      service.findAll.mockResolvedValue(resultMock);

      // Testando com os 3 parâmetros preenchidos
      const result = await controller.findAll('2026-02', PagamentoStatus.PENDENTE, 'cuidador-123');

      expect(service.findAll).toHaveBeenCalledWith('2026-02', PagamentoStatus.PENDENTE, 'cuidador-123');
      expect(result).toEqual(resultMock);
    });

    it('deve chamar o serviço com parâmetros undefined caso não sejam enviados na query', async () => {
      service.findAll.mockResolvedValue([]);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
    });
  });

  describe('gerarRelatorio', () => {
    it('deve chamar o serviço repassando o mês e retornar o relatório', async () => {
      const resultMock = { mes: '2026-02', totalBruto: 480.0 };
      service.gerarRelatorio.mockResolvedValue(resultMock);

      const result = await controller.gerarRelatorio('2026-02');

      expect(service.gerarRelatorio).toHaveBeenCalledWith('2026-02');
      expect(result).toEqual(resultMock);
    });
  });

  describe('findById', () => {
    it('deve chamar o serviço com o ID correto e retornar o pagamento', async () => {
      const resultMock = { id: 'pagamento-123', status: PagamentoStatus.PENDENTE };
      service.findById.mockResolvedValue(resultMock);

      const result = await controller.findById('pagamento-123');

      expect(service.findById).toHaveBeenCalledWith('pagamento-123');
      expect(result).toEqual(resultMock);
    });
  });

  describe('marcarComoProcessado', () => {
    it('deve chamar o serviço para processar o pagamento', async () => {
      const resultMock = { id: 'pagamento-123', status: PagamentoStatus.PROCESSADO };
      service.marcarComoProcessado.mockResolvedValue(resultMock);

      const result = await controller.marcarComoProcessado('pagamento-123');

      expect(service.marcarComoProcessado).toHaveBeenCalledWith('pagamento-123');
      expect(result).toEqual(resultMock);
    });
  });

  describe('confirmarPagamento', () => {
    it('deve chamar o serviço com o ID e o DTO de confirmação', async () => {
      const dto = { numeroComprovante: 'COMP-999', dataPagamento: '2026-02-26' } as any;
      const resultMock = { id: 'pagamento-123', status: 'PAID' };
      
      service.confirmarPagamento.mockResolvedValue(resultMock);

      const result = await controller.confirmarPagamento('pagamento-123', dto);

      expect(service.confirmarPagamento).toHaveBeenCalledWith('pagamento-123', dto);
      expect(result).toEqual(resultMock);
    });
  });

  describe('delete', () => {
    it('deve chamar o serviço para deletar o pagamento', async () => {
      const resultMock = { id: 'pagamento-123', status: PagamentoStatus.PENDENTE };
      service.delete.mockResolvedValue(resultMock);

      const result = await controller.delete('pagamento-123');

      expect(service.delete).toHaveBeenCalledWith('pagamento-123');
      expect(result).toEqual(resultMock);
    });
  });

  describe('findMy', () => {
    it('deve extrair o cuidadorId do token e chamar o serviço correspondente', async () => {
      // Simulação do Request injetado pelo framework após o JwtAuthGuard
      const reqMock = {
        user: { cuidadorId: 'meu-cuidador-id-123' },
      };
      const resultMock = [{ id: 'pagamento-123', valorLiquido: 144.0 }];
      
      service.findMy.mockResolvedValue(resultMock);

      const result = await controller.findMy(reqMock);

      expect(service.findMy).toHaveBeenCalledWith('meu-cuidador-id-123');
      expect(result).toEqual(resultMock);
    });
  });
});