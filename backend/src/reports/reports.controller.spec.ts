import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

// 1. Criamos o dublê do serviço com os três métodos do seu controller
const mockReportsService = {
    getAdminStats: jest.fn(),
    getCaregiverReport: jest.fn(),
    getFamilyReport: jest.fn(),
};

describe('ReportsController', () => {
    let controller: ReportsController;
    let service: typeof mockReportsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReportsController],
            providers: [
                {
                    provide: ReportsService,
                    useValue: mockReportsService,
                },
            ],
        }).compile();

        controller = module.get<ReportsController>(ReportsController);
        // Pegamos a referência do mock para podermos verificar se ele foi chamado
        service = module.get(ReportsService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('getAdminStats', () => {
        it('deve chamar o serviço e retornar as estatísticas globais', async () => {
            // Preparamos uma resposta falsa qualquer, pois o formato exato 
            // será validado no teste do Service, não no do Controller.
            const resultMock = { totalPacientes: 50, receita: 15000 };
            service.getAdminStats.mockResolvedValue(resultMock);

            const response = await controller.getAdminStats();

            expect(service.getAdminStats).toHaveBeenCalled();
            expect(response).toEqual(resultMock);
        });
    });

    describe('getCaregiverReport', () => {
        it('deve extrair o cuidadorId do token da requisição e repassar ao serviço', async () => {
            // 2. Criamos o nosso objeto de requisição "falso"
            // Ele tem exatamente o formato que o seu @Request() req injeta
            const reqMock = {
                user: {
                    cuidadorId: 'id-do-cuidador-123'
                }
            };
            
            const resultMock = { horasTrabalhadas: 40, valorReceber: 800 };
            service.getCaregiverReport.mockResolvedValue(resultMock);

            // 3. Passamos a requisição falsa para o método do controller
            const response = await controller.getCaregiverReport(reqMock);

            // 4. Garantimos que o controller soube "pescar" o ID correto de dentro do req.user
            expect(service.getCaregiverReport).toHaveBeenCalledWith('id-do-cuidador-123');
            expect(response).toEqual(resultMock);
        });
    });

    describe('getFamilyReport', () => {
        it('deve extrair o userId do token da requisição e repassar ao serviço', async () => {
            const reqMock = {
                user: {
                    userId: 'id-do-familiar-456'
                }
            };
            
            const resultMock = { pacientesAtivos: 2, totalGasto: 1600 };
            service.getFamilyReport.mockResolvedValue(resultMock);

            const response = await controller.getFamilyReport(reqMock);

            expect(service.getFamilyReport).toHaveBeenCalledWith('id-do-familiar-456');
            expect(response).toEqual(resultMock);
        });
    });
});