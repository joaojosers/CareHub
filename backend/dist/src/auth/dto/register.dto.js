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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const class_validator_2 = require("class-validator");
const client_2 = require("@prisma/client");
class RegisterDto {
    nome;
    email;
    senha;
    cpf;
    telefone;
    tipo;
    status;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome completo do usuário', example: 'João da Silva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome é obrigatório' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'E-mail para login', example: 'joao@email.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Por favor, insira um e-mail válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha de acesso (mínimo 6 caracteres)', example: 'senha123', minLength: 6 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha é obrigatória' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "senha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'CPF do usuário', example: '123.456.789-00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O CPF é obrigatório' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '11999998888', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo de usuário (CUIDADOR ou FAMILIAR)', enum: client_1.UserRole, example: 'CUIDADOR' }),
    (0, class_validator_1.IsEnum)(client_1.UserRole, { message: 'O tipo de usuário deve ser CUIDADOR ou FAMILIAR' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_2.UserStatus),
    __metadata("design:type", String)
], RegisterDto.prototype, "status", void 0);
//# sourceMappingURL=register.dto.js.map