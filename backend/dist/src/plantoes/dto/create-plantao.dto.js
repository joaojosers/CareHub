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
exports.CreatePlantaoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const relatorio_dto_1 = require("./relatorio.dto");
class CreatePlantaoDto {
    pacienteId;
    cuidadorId;
    dataInicio;
    dataFim;
    relatorio;
}
exports.CreatePlantaoDto = CreatePlantaoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do paciente', example: 'uuid-do-paciente' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do paciente inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do paciente é obrigatório' }),
    __metadata("design:type", String)
], CreatePlantaoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do cuidador (opcional na criação)', example: 'uuid-do-cuidador' }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do cuidador inválido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePlantaoDto.prototype, "cuidadorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data e hora de início (ISO 8601)', example: '2026-06-01T08:00:00Z' }),
    (0, class_validator_1.IsISO8601)({}, { message: 'A data de início deve estar no formato ISO (AAAA-MM-DDTHH:mm:ss)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de início é obrigatória' }),
    __metadata("design:type", String)
], CreatePlantaoDto.prototype, "dataInicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data e hora de fim (ISO 8601)', example: '2026-06-01T20:00:00Z' }),
    (0, class_validator_1.IsISO8601)({}, { message: 'A data de fim deve estar no formato ISO (AAAA-MM-DDTHH:mm:ss)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de fim é obrigatória' }),
    __metadata("design:type", String)
], CreatePlantaoDto.prototype, "dataFim", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: relatorio_dto_1.RelatorioDto, description: 'Relatório estruturado do plantão' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => relatorio_dto_1.RelatorioDto),
    __metadata("design:type", relatorio_dto_1.RelatorioDto)
], CreatePlantaoDto.prototype, "relatorio", void 0);
//# sourceMappingURL=create-plantao.dto.js.map