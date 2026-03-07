import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsDto {
    @ApiProperty({ example: 10 })
    totalCuidadores: number;

    @ApiProperty({ example: 15 })
    totalPacientes: number;

    @ApiProperty({ example: 45 })
    totalPlantoes: number;

    @ApiProperty({ example: 540.5 })
    horasTrabalhadas: number;

    @ApiProperty({ example: 1200.0 })
    totalRevenue: number;

    @ApiProperty({ example: 12000.0 })
    totalProcessado: number;
}

export class PatientBreakdownDto {
    @ApiProperty({ example: 'José Oliveira' })
    nome: string;

    @ApiProperty({ example: 48 })
    horas: number;

    @ApiProperty({ example: 4 })
    plantoes: number;
}

export class CaregiverReportDto {
    @ApiProperty({ example: 2400.0 })
    totalEarned: number;

    @ApiProperty({ example: 120.0 })
    totalHours: number;

    @ApiProperty({ example: 12.0 })
    averageHoursPerShift: number;

    @ApiProperty({ type: [PatientBreakdownDto] })
    breakdownByPatient: PatientBreakdownDto[];
}
