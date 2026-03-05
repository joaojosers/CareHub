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
exports.CreatePagamentoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreatePagamentoDto {
    plantaoId;
    metodoPagamento;
}
exports.CreatePagamentoDto = CreatePagamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do plantão aprovado a ser pago',
        example: 'uuid-do-plantao',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePagamentoDto.prototype, "plantaoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Método de pagamento',
        enum: client_1.MetodoPagamento,
        default: client_1.MetodoPagamento.PIX,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.MetodoPagamento),
    __metadata("design:type", String)
], CreatePagamentoDto.prototype, "metodoPagamento", void 0);
//# sourceMappingURL=create-pagamento.dto.js.map