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
exports.FamiliaresService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let FamiliaresService = class FamiliaresService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async vincularPaciente(userId, dto) {
        const paciente = await this.databaseService.client.paciente.findUnique({
            where: { id: dto.pacienteId },
        });
        if (!paciente) {
            throw new common_1.NotFoundException('Paciente não encontrado');
        }
        const vinculoExistente = await this.databaseService.client.familiarVinculo.findUnique({
            where: {
                userId_pacienteId: {
                    userId,
                    pacienteId: dto.pacienteId,
                },
            },
        });
        if (vinculoExistente) {
            throw new common_1.ConflictException('Você já possui um vínculo com este paciente');
        }
        return this.databaseService.client.familiarVinculo.create({
            data: {
                userId,
                pacienteId: dto.pacienteId,
                parentesco: dto.parentesco,
                isResponsavelFinanceiro: dto.isResponsavelFinanceiro || false,
            },
            include: {
                paciente: true,
            },
        });
    }
    async findMeusPacientes(userId) {
        return this.databaseService.client.familiarVinculo.findMany({
            where: { userId },
            include: {
                paciente: true,
            },
        });
    }
};
exports.FamiliaresService = FamiliaresService;
exports.FamiliaresService = FamiliaresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], FamiliaresService);
//# sourceMappingURL=familiares.service.js.map