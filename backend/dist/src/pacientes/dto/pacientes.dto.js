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
exports.CreatePacienteDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const endereco_dto_1 = require("../../common/dto/endereco.dto");
class CreatePacienteDto {
    nome;
    dataNascimento;
    necessidades;
    endereco;
    familiarId;
    parentesco;
    isResponsavelFinanceiro;
}
exports.CreatePacienteDto = CreatePacienteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome completo do paciente', example: 'Dona Maria de Oliveira' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do paciente é obrigatório' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data de nascimento (ISO 8601)', example: '1950-05-20T00:00:00Z' }),
    (0, class_validator_1.IsDateString)({}, { message: 'A data de nascimento deve estar no formato ISO (AAAA-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de nascimento é obrigatória' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "dataNascimento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detalhes sobre necessidades especiais e histórico', example: 'Paciente diabética, necessita de insulina.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "necessidades", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: endereco_dto_1.EnderecoDto, description: 'Endereço do paciente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => endereco_dto_1.EnderecoDto),
    __metadata("design:type", endereco_dto_1.EnderecoDto)
], CreatePacienteDto.prototype, "endereco", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do usuário (familiar) já cadastrado', example: '0d85a3dd-289c-474c-84e6-a95ba1939bc3' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do familiar é obrigatório para o vínculo' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "familiarId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grau de parentesco', example: 'Filho(a)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O parentesco é obrigatório' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "parentesco", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Define se é o responsável financeiro', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePacienteDto.prototype, "isResponsavelFinanceiro", void 0);
//# sourceMappingURL=pacientes.dto.js.map