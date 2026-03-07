import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { DatabaseService } from '../database/database.service';

// Mock do DatabaseService recriando a estrutura exata que o Service usa
const mockDatabaseService = {
  client: {
    user: { count: jest.fn() },
    paciente: { count: jest.fn() },
    plantao: { count: jest.fn(), aggregate: jest.fn(), findMany: jest.fn() },
    pagamento: { findMany: jest.fn() },
    familiarVinculo: { findMany: jest.fn() },
  },
};

describe('ReportsService', () => {
  let service: ReportsService;
  let database: typeof mockDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    database = module.get(DatabaseService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminStats', () => {
    it('deve calcular corretamente as estatísticas globais', async () => {
      // 1. Mockamos as contagens individuais
      database.client.user.count.mockResolvedValue(5);
      database.client.paciente.count.mockResolvedValue(10);
      database.client.plantao.count.mockResolvedValue(20);

      // 2. Mockamos os pagamentos para testar a soma (reduce)
      // Usamos strings numéricas para simular o tipo Decimal do Prisma
      database.client.pagamento.findMany.mockResolvedValue([
        { taxaPlataforma: '15.50', valorBruto: '100.00' },
        { taxaPlataforma: '10.00', valorBruto: '50.00' },
      ]);

      // 3. Mockamos o aggregate do Prisma
      database.client.plantao.aggregate.mockResolvedValue({
        _sum: { horasTrabalhadas: 120.5 },
      });

      const result = await service.getAdminStats();

      // Verificamos se a matemática do reduce funcionou corretamente
      expect(result).toEqual({
        totalCuidadores: 5,
        totalPacientes: 10,
        totalPlantoes: 20,
        horasTrabalhadas: 120.5,
        totalRevenue: 25.50, // 15.50 + 10.00
        totalProcessado: 150.00, // 100.00 + 50.00
      });
    });
  });

  describe('getCaregiverReport', () => {
    it('deve agrupar dados por paciente e calcular os totais do cuidador', async () => {
      const cuidadorId = 'cuidador-123';

      database.client.pagamento.findMany.mockResolvedValue([
        { valorLiquido: '200' },
        { valorLiquido: '300' },
      ]);

      // Criamos dois plantões para o Paciente A e um para o Paciente B
      database.client.plantao.findMany.mockResolvedValue([
        { horasTrabalhadas: 4, pacienteId: 'pac-A', paciente: { nome: 'João' } },
        { horasTrabalhadas: 6, pacienteId: 'pac-A', paciente: { nome: 'João' } },
        { horasTrabalhadas: 5, pacienteId: 'pac-B', paciente: { nome: 'Maria' } },
      ]);

      const result = await service.getCaregiverReport(cuidadorId);

      expect(database.client.plantao.findMany).toHaveBeenCalledWith({
        where: { cuidadorId, status: 'APROVADO' },
        include: { paciente: true },
      });

      expect(result.totalEarned).toBe(500); // 200 + 300
      expect(result.totalHours).toBe(15); // 4 + 6 + 5
      expect(result.averageHoursPerShift).toBe(5); // 15 horas / 3 plantões

      // Verifica se o agrupamento por paciente deu certo
      expect(result.breakdownByPatient).toEqual(
        expect.arrayContaining([
          { nome: 'João', horas: 10, plantoes: 2 },
          { nome: 'Maria', horas: 5, plantoes: 1 },
        ])
      );
    });
  });

  describe('getFamilyReport', () => {
    it('deve mapear os vínculos familiares e extrair dados aninhados (incluindo fallback de relatórios)', async () => {
      // Mockamos a estrutura profundamente aninhada que o Prisma retorna
      const mockVinculos = [
        {
          paciente: {
            nome: 'Sr. Alberto',
            plantoes: [
              {
                dataInicio: new Date('2023-10-01T08:00:00Z'),
                dataFim: new Date('2023-10-01T12:00:00Z'),
                horasTrabalhadas: 4,
                cuidador: { user: { nome: 'Cuidador Carlos' } },
                relatorioAtividade: { descricao: 'Tudo bem hoje' }, // Novo formato
                relatorioLegacy: null,
              },
              {
                dataInicio: new Date('2023-10-02T08:00:00Z'),
                dataFim: new Date('2023-10-02T12:00:00Z'),
                horasTrabalhadas: 4,
                cuidador: { user: { nome: 'Cuidadora Ana' } },
                relatorioAtividade: null,
                relatorioLegacy: 'Relatório antigo', // Formato legado (fallback)
              },
            ],
          },
        },
      ];

      database.client.familiarVinculo.findMany.mockResolvedValue(mockVinculos as any);

      const result = await service.getFamilyReport('familiar-123');

      expect(result).toHaveLength(1);
      
      const relatorioPaciente = result[0];
      expect(relatorioPaciente.paciente).toBe('Sr. Alberto');
      expect(relatorioPaciente.totalHours).toBe(8); // 4 + 4
      expect(relatorioPaciente.totalPlantoes).toBe(2);
      
      // Verifica se extraiu cuidadores únicos corretamente
      expect(relatorioPaciente.cuidadores).toEqual(['Cuidador Carlos', 'Cuidadora Ana']);

      // Verifica se o fallback do relatório funcionou (pegou o novo no primeiro e o legado no segundo)
      expect(relatorioPaciente.plantoes[0].relatorio).toBe('Tudo bem hoje');
      expect(relatorioPaciente.plantoes[1].relatorio).toBe('Relatório antigo');
    });
  });
});