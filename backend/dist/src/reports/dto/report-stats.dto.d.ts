export declare class AdminStatsDto {
    totalCuidadores: number;
    totalPacientes: number;
    totalPlantoes: number;
    horasTrabalhadas: number;
    totalRevenue: number;
    totalProcessado: number;
}
export declare class PatientBreakdownDto {
    nome: string;
    horas: number;
    plantoes: number;
}
export declare class CaregiverReportDto {
    totalEarned: number;
    totalHours: number;
    averageHoursPerShift: number;
    breakdownByPatient: PatientBreakdownDto[];
}
