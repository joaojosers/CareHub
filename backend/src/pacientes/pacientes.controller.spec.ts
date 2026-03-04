import { Test, TestingModule } from '@nestjs/testing';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/pacientes.dto';

// 1. Dublê do serviço espelhando os métodos do Controller
const mockPacientesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
};

describe('PacientesController', () => {
    let controller: PacientesController;
    let service: typeof mockPacientesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PacientesController],
            providers: [
                {
                    provide: PacientesService,
                    useValue: mockPacientesService,
                },
            ],
        }).compile();

        controller = module.get<PacientesController>(PacientesController);
        service = module.get(PacientesService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('deve chamar o serviço com o DTO e retornar o paciente criado', async () => {
            // Simulamos o corpo da requisição
            const createDto = {
                nome: 'Sr. Alberto',
                dataNascimento: '1945-05-12T00:00:00.000Z',
                necessidades: 'Acompanhamento diário',
            } as CreatePacienteDto;

            const resultMock = { id: 'paciente-123', ...createDto };
            service.create.mockResolvedValue(resultMock);

            const result = await controller.create(createDto);

            // Valida se o Controller enviou os dados intactos para o Service
            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(resultMock);
        });
    });

    describe('findAll', () => {
        it('deve chamar o serviço e retornar a lista de pacientes', async () => {
            const resultMock = [
                { id: '1', nome: 'Sr. Alberto' },
                { id: '2', nome: 'Dona Maria' },
            ];
            
            service.findAll.mockResolvedValue(resultMock);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(resultMock);
        });
    });

    describe('findOne', () => {
        it('deve chamar o serviço repassando o ID e retornar o paciente', async () => {
            const pacienteId = 'paciente-123';
            const resultMock = { id: pacienteId, nome: 'Sr. Alberto' };
            
            service.findOne.mockResolvedValue(resultMock);

            const result = await controller.findOne(pacienteId);

            expect(service.findOne).toHaveBeenCalledWith(pacienteId);
            expect(result).toEqual(resultMock);
        });
    });
});