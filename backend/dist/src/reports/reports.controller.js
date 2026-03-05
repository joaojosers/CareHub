"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const report_stats_dto_1 = require("./dto/report-stats.dto");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getAdminStats() {
        return this.reportsService.getAdminStats();
    }
    async getCaregiverReport(req) {
        const cuidadorId = req.user.cuidadorId;
        return this.reportsService.getCaregiverReport(cuidadorId);
    }
    async getFamilyReport(req) {
        const userId = req.user.userId;
        return this.reportsService.getFamilyReport(userId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Estatísticas globais da plataforma (Admin)',
        description: 'Retorna métricas de usuários, pacientes, plantões e receita.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estatísticas retornadas com sucesso', type: report_stats_dto_1.AdminStatsDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Get)('caregiver/me'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CUIDADOR),
    (0, swagger_1.ApiOperation)({
        summary: 'Relatório de performance do cuidador (Cuidador)',
        description: 'Retorna total ganho, horas trabalhadas e detalhamento por paciente.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Relatório retornado com sucesso', type: report_stats_dto_1.CaregiverReportDto }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getCaregiverReport", null);
__decorate([
    (0, common_1.Get)('family/patients'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.FAMILIAR),
    (0, swagger_1.ApiOperation)({
        summary: 'Resumo de atividades dos pacientes vinculados (Familiar)',
        description: 'Retorna histórico de plantões e horas para todos os pacientes sob responsabilidade do familiar.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Relatório retornado com sucesso' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getFamilyReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map