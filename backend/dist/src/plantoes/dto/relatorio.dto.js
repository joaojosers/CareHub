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
exports.RelatorioDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RelatorioDto {
    descricao;
    medicacoes;
    pressaoArterial;
    observacoes;
}
exports.RelatorioDto = RelatorioDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Paciente passou bem o dia, alimentou-se corretamente.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RelatorioDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Losartana 50mg às 08:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RelatorioDto.prototype, "medicacoes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12/8' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RelatorioDto.prototype, "pressaoArterial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dormiu mais que o habitual na parte da tarde.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RelatorioDto.prototype, "observacoes", void 0);
//# sourceMappingURL=relatorio.dto.js.map