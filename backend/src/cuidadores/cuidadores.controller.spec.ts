import { Test, TestingModule } from '@nestjs/testing';
import { CuidadoresController } from './cuidadores.controller';
import { CuidadoresService } from './cuidadores.service';
import { CreateCuidadorDto } from './dto/create-cuidador.dto';

// 1. Criamos o dublê do serviço com os três métodos do Controller
const mockCuidadoresService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
};

describe('CuidadoresController', () => {
    let controller: CuidadoresController;
    let service: typeof mockCuidadoresService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CuidadoresController],
            providers: [
                {
                    provide: CuidadoresService,
                    useValue: mockCuidadoresService,
                },
            ],
        }).compile();

        controller = module.get<CuidadoresController>(CuidadoresController);
        // Pegamos a referência do mock para podermos verificar chamadas
        service = module.get(CuidadoresService);
    });

    // Limpamos o histórico de chamadas antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('deve chamar o serviço com o DTO e retornar o cuidador criado', async () => {
            // Montamos um DTO falso para simular o Body da requisição
            const createDto = {
                nome: 'Maria Silva',
                email: 'maria@email.com',
                senha: '123',
                cpf: '12345678901',
                especialidades: ['Alzheimer', 'Parkinson'],
                valorHora: 30,
            } as CreateCuidadorDto; // Usamos o "as" para não precisar preencher dados opcionais

            const resultMock = { id: 'uuid-123', ...createDto };
            
            // Dizemos o que o serviço deve devolver
            service.create.mockResolvedValue(resultMock);

            const result = await controller.create(createDto);

            // Verificamos se o Controller repassou o DTO certinho pro Service
            expect(service.create).toHaveBeenCalledWith(createDto);
            expect(result).toEqual(resultMock);
        });
    });

    describe('findAll', () => {
        it('deve chamar o serviço e retornar uma lista de cuidadores', async () => {
            const resultMock = [
                { id: '1', nome: 'Maria Silva' },
                { id: '2', nome: 'Carlos Souza' },
            ];
            
            service.findAll.mockResolvedValue(resultMock);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(resultMock);
        });
    });

    describe('findOne', () => {
        it('deve chamar o serviço repassando o ID e retornar o cuidador', async () => {
            const cuidadorId = 'uuid-cuidador-123';
            const resultMock = { id: cuidadorId, nome: 'Maria Silva' };
            
            service.findOne.mockResolvedValue(resultMock);

            const result = await controller.findOne(cuidadorId);

            expect(service.findOne).toHaveBeenCalledWith(cuidadorId);
            expect(result).toEqual(resultMock);
        });
    });
});