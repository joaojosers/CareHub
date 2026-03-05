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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaregiverReportDto = exports.PatientBreakdownDto = exports.AdminStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class AdminStatsDto {
    totalCuidadores;
    totalPacientes;
    totalPlantoes;
    horasTrabalhadas;
    totalRevenue;
    totalProcessado;
}
exports.AdminStatsDto = AdminStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], AdminStatsDto.prototype, "totalCuidadores", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], AdminStatsDto.prototype, "totalPacientes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45 }),
    __metadata("design:type", Number)
], AdminStatsDto.prototype, "totalPlantoes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 540.5 }),
    __metadata("design:type", Number)
], AdminStatsDto.prototype, "horasTrabalhadas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200.0 }),
    __metadata("design:type", Number)
], AdminStatsDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12000.0 }),
    __metadata("design:type", Number)
], AdminStatsDto.prototype, "totalProcessado", void 0);
class PatientBreakdownDto {
    nome;
    horas;
    plantoes;
}
exports.PatientBreakdownDto = PatientBreakdownDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'José Oliveira' }),
    __metadata("design:type", String)
], PatientBreakdownDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48 }),
    __metadata("design:type", Number)
], PatientBreakdownDto.prototype, "horas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4 }),
    __metadata("design:type", Number)
], PatientBreakdownDto.prototype, "plantoes", void 0);
class CaregiverReportDto {
    totalEarned;
    totalHours;
    averageHoursPerShift;
    breakdownByPatient;
}
exports.CaregiverReportDto = CaregiverReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2400.0 }),
    __metadata("design:type", Number)
], CaregiverReportDto.prototype, "totalEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120.0 }),
    __metadata("design:type", Number)
], CaregiverReportDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.0 }),
    __metadata("design:type", Number)
], CaregiverReportDto.prototype, "averageHoursPerShift", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PatientBreakdownDto] }),
    __metadata("design:type", Array)
], CaregiverReportDto.prototype, "breakdownByPatient", void 0);
//# sourceMappingURL=report-stats.dto.js.map