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
exports.VincularPacienteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VincularPacienteDto {
    pacienteId;
    userId;
    parentesco;
    isResponsavelFinanceiro;
}
exports.VincularPacienteDto = VincularPacienteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID do paciente que será vinculado',
        example: '5c41d066-0fd8-4959-919c-c02ffd5fbe02'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do paciente inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do paciente é obrigatório' }),
    __metadata("design:type", String)
], VincularPacienteDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID do usuário (familiar) que será vinculado',
        example: '0d85a3dd-289c-474c-84e6-a95ba1939bc3'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'ID do usuário inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do usuário é obrigatório' }),
    __metadata("design:type", String)
], VincularPacienteDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grau de parentesco entre o familiar e o paciente',
        example: 'Filho(a)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O grau de parentesco é obrigatório (ex: Filho, Cônjuge)' }),
    __metadata("design:type", String)
], VincularPacienteDto.prototype, "parentesco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Define se este familiar é o responsável pelo pagamento',
        default: false,
        required: false
    }),
    (0, class_validator_1.IsBoolean)({ message: 'O campo responsável financeiro deve ser um booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], VincularPacienteDto.prototype, "isResponsavelFinanceiro", void 0);
//# sourceMappingURL=vincular-paciente.dto.js.map