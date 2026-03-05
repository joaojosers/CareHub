import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getAdminStats(): Promise<{
        totalCuidadores: number;
        totalPacientes: number;
        totalPlantoes: number;
        horasTrabalhadas: number;
        totalRevenue: number;
        totalProcessado: number;
    }>;
    getCaregiverReport(req: any): Promise<{
        totalEarned: number;
        totalHours: number;
        averageHoursPerShift: number;
        breakdownByPatient: {
            nome: string;
            horas: number;
            plantoes: number;
        }[];
    }>;
    getFamilyReport(req: any): Promise<{
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
