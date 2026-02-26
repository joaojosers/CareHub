import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserStatus } from '@prisma/client';

// 1. Criamos um "dublê" do serviço. 
// Usamos jest.fn() para criar funções vazias que podemos monitorar depois.
const mockUsersService = {
  findAll: jest.fn(),
  updateStatus: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    // 2. Criamos o módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          // 3. O "pulo do gato": dizemos ao Nest para usar nosso dublê 
          // toda vez que o Controller pedir o UsersService real.
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // 4. Limpamos o histórico do dublê antes de cada teste 
  // para que um teste não interfira no outro.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // Agrupamos os testes do método findAll
  describe('findAll', () => {
    it('deve retornar uma lista de usuários sem filtro de status', async () => {
      // Preparamos o que o dublê vai devolver quando for chamado
      const resultMock = [{ id: '1', name: 'Carlos', status: UserStatus.APROVADO }];
      mockUsersService.findAll.mockResolvedValue(resultMock);

      // Executamos o método do controller (sem passar parâmetro)
      const response = await controller.findAll();

      // Verificamos se o dublê foi chamado com os argumentos certos (undefined)
      expect(service.findAll).toHaveBeenCalledWith(undefined);
      // Verificamos se o controller devolveu exatamente o que o serviço entregou
      expect(response).toEqual(resultMock);
    });

    it('deve retornar uma lista filtrada quando o status for passado', async () => {
      const resultMock = [{ id: '2', name: 'Ana', status: UserStatus.PENDENTE }];
      mockUsersService.findAll.mockResolvedValue(resultMock);

      // Executamos passando o parâmetro PENDENTE
      const response = await controller.findAll(UserStatus.PENDENTE);

      expect(service.findAll).toHaveBeenCalledWith(UserStatus.PENDENTE);
      expect(response).toEqual(resultMock);
    });
  });

  describe('approveUser', () => {
    it('deve chamar o serviço com UserStatus.APROVADO e retornar o resultado', async () => {
      const userId = '123';
      const resultMock = { id: userId, status: UserStatus.APROVADO };
      mockUsersService.updateStatus.mockResolvedValue(resultMock);

      const response = await controller.approveUser(userId);

      // Aqui garantimos que o controller traduziu a rota para a chamada certa do service
      expect(service.updateStatus).toHaveBeenCalledWith(userId, UserStatus.APROVADO);
      expect(response).toEqual(resultMock);
    });
  });

  describe('rejectUser', () => {
    it('deve chamar o serviço com UserStatus.REJEITADO e retornar o resultado', async () => {
      const userId = '123';
      const resultMock = { id: userId, status: UserStatus.REJEITADO };
      mockUsersService.updateStatus.mockResolvedValue(resultMock);

      const response = await controller.rejectUser(userId);

      expect(service.updateStatus).toHaveBeenCalledWith(userId, UserStatus.REJEITADO);
      expect(response).toEqual(resultMock);
    });
  });
});