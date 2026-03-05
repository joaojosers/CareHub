import { DatabaseService } from '../database/database.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    getAdminStats(): Promise<{
        totalCuidadores: number;
        totalPacientes: number;
        totalPlantoes: number;
        horasTrabalhadas: number;
        totalRevenue: number;
        totalProcessado: number;
    }>;
    getCaregiverReport(cuidadorId: string): Promise<{
        totalEarned: number;
        totalHours: number;
        averageHoursPerShift: number;
        breakdownByPatient: {
            nome: string;
            horas: number;
            plantoes: number;
        }[];
    }>;
    getFamilyReport(userId: string): Promise<{
        paciente: string;
        totalHours: number;
        totalPlantoes: number;
        cuidadores: (string | undefined)[];
        plantoes: {
            dataInicio: Date;
            dataFim: Date;
            horas: number;
            cuidador: string | undefined;
            relatorio: string | null;
        }[];
    }[]>;
}
