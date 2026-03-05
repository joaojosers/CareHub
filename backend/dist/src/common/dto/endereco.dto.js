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
exports.EnderecoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class EnderecoDto {
    logradouro;
    numero;
    complemento;
    bairro;
    cidade;
    estado;
    cep;
    referencia;
}
exports.EnderecoDto = EnderecoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rua das Flores' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "logradouro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "numero", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Apto 45' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "complemento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Centro' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "bairro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'São Paulo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "cidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SP' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], EnderecoDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '01234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(8),
    __metadata("design:type", String)
], EnderecoDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Próximo ao mercado' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], EnderecoDto.prototype, "referencia", void 0);
//# sourceMappingURL=endereco.dto.js.map