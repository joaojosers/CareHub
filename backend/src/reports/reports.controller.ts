import {
    Controller,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AdminStatsDto, CaregiverReportDto } from './dto/report-stats.dto';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('admin/stats')
    @Roles(UserRole.ADMIN)
    @ApiOperation({
        summary: 'Estatísticas globais da plataforma (Admin)',
        description: 'Retorna métricas de usuários, pacientes, plantões e receita.',
    })
    @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso', type: AdminStatsDto })
    async getAdminStats() {
        return this.reportsService.getAdminStats();
    }

    @Get('caregiver/me')
    @Roles(UserRole.CUIDADOR)
    @ApiOperation({
        summary: 'Relatório de performance do cuidador (Cuidador)',
        description: 'Retorna total ganho, horas trabalhadas e detalhamento por paciente.',
    })
    @ApiResponse({ status: 200, description: 'Relatório retornado com sucesso', type: CaregiverReportDto })
    async getCaregiverReport(@Request() req: any) {
        const cuidadorId = req.user.cuidadorId;
        return this.reportsService.getCaregiverReport(cuidadorId);
    }

    @Get('family/patients')
    @Roles(UserRole.FAMILIAR)
    @ApiOperation({
        summary: 'Resumo de atividades dos pacientes vinculados (Familiar)',
        description: 'Retorna histórico de plantões e horas para todos os pacientes sob responsabilidade do familiar.',
    })
    @ApiResponse({ status: 200, description: 'Relatório retornado com sucesso' })
    async getFamilyReport(@Request() req: any) {
        const userId = req.user.userId;
        return this.reportsService.getFamilyReport(userId);
    }
}
