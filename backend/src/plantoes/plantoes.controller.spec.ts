import { Test, TestingModule } from '@nestjs/testing';
import { PlantoesController } from './plantoes.controller';
import { PlantoesService } from './plantoes.service';
import { UserRole, PlantaoStatus } from '@prisma/client';
import { CreatePlantaoDto } from './dto/create-plantao.dto';

// 1. Dublê do serviço com todos os métodos que o Controller chama
const mockPlantoesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByCuidador: jest.fn(),
    findByFamiliar: jest.fn(),
    updateStatus: jest.fn(),
};

describe('PlantoesController', () => {
    let controller: PlantoesController;
    let service: typeof mockPlantoesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlantoesController],
            providers: [
                {
                    provide: PlantoesService,
                    useValue: mockPlantoesService,
                },
            ],
        }).compile();

        controller = module.get<PlantoesController>(PlantoesController);
        service = module.get(PlantoesService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('deve chamar o serviço com o DTO e retornar o plantão criado', async () => {
            const createDto = {
                pacienteId: 'pac-123',
                dataInicio: new Date().toISOString(),
                dataFim: new Date().toISOString(),
                horasTrabalhadas: 8,
            } as any; // Usando as any/as CreatePlantaoDto para simplificar o mock

            const resultMock = { id: 'plantao-123', ...createDto };
            service.create.mockResolvedValue(resultMock);

            const result = await controller.create(createDto);

            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(resultMock);
        });
    });

    describe('findAll', () => {
        it('deve chamar o serviço e retornar a lista de todos os plantões', async () => {
            const resultMock = [{ id: '1', status: PlantaoStatus.PENDENTE }];
            service.findAll.mockResolvedValue(resultMock);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(resultMock);
        });
    });

    // Aqui está a parte especial deste Controller!
    describe('findMyPlantoes', () => {
        it('deve buscar plantões pelo CUIDADOR se a role do usuário for CUIDADOR', async () => {
            // Criamos a requisição falsa simulando um Cuidador
            const reqMock = {
                user: { userId: 'cuidador-123', role: UserRole.CUIDADOR }
            };
            const resultMock = [{ id: '1', cuidadorId: 'cuidador-123' }];
            service.findByCuidador.mockResolvedValue(resultMock);

            const result = await controller.findMyPlantoes(reqMock);

            // Verificamos se ele entrou no 'if' certo
            expect(service.findByCuidador).toHaveBeenCalledWith('cuidador-123');
            // Garantimos que ele NÃO chamou o método do familiar acidentalmente
            expect(service.findByFamiliar).not.toHaveBeenCalled(); 
            expect(result).toEqual(resultMock);
        });

        it('deve buscar plantões pelo FAMILIAR se a role do usuário for FAMILIAR', async () => {
            // Criamos a requisição falsa simulando um Familiar
            const reqMock = {
                user: { userId: 'familiar-456', role: UserRole.FAMILIAR }
            };
            const resultMock = [{ id: '2', pacienteId: 'pac-999' }];
            service.findByFamiliar.mockResolvedValue(resultMock);

            const result = await controller.findMyPlantoes(reqMock);

            // Verificamos se ele entrou no 'else if' certo
            expect(service.findByFamiliar).toHaveBeenCalledWith('familiar-456');
            // Garantimos que ele NÃO chamou o método do cuidador acidentalmente
            expect(service.findByCuidador).not.toHaveBeenCalled();
            expect(result).toEqual(resultMock);
        });
    });

    describe('updateStatus', () => {
        it('deve chamar o serviço para atualizar o status do plantão e retornar o resultado', async () => {
            const plantaoId = 'plantao-123';
            const novoStatus = PlantaoStatus.APROVADO;
            const resultMock = { id: plantaoId, status: novoStatus };
            
            service.updateStatus.mockResolvedValue(resultMock);

            const result = await controller.updateStatus(plantaoId, novoStatus);

            expect(service.updateStatus).toHaveBeenCalledWith(plantaoId, novoStatus);
            expect(result).toEqual(resultMock);
        });
    });
});