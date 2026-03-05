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
exports.CreateCuidadorDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const endereco_dto_1 = require("../../common/dto/endereco.dto");
const documento_dto_1 = require("./documento.dto");
class CreateCuidadorDto {
    nome;
    email;
    senha;
    cpf;
    telefone;
    especialidades;
    dadosBancarios;
    documentos;
    endereco;
}
exports.CreateCuidadorDto = CreateCuidadorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nome completo do cuidador', example: 'Ana Maria Ferreira' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome é obrigatório' }),
    __metadata("design:type", String)
], CreateCuidadorDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'E-mail para login', example: 'ana.ferreira@email.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail é obrigatório' }),
    __metadata("design:type", String)
], CreateCuidadorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha de acesso', example: 'SenhaSegura123', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    __metadata("design:type", String)
], CreateCuidadorDto.prototype, "senha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'CPF do cuidador (sem pontuação)', example: '12345678900' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O CPF é obrigatório' }),
    __metadata("design:type", String)
], CreateCuidadorDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Telefone de contato', example: '11999999999' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCuidadorDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lista de especialidades', example: ['Enfermagem', 'Cuidados Paliativos'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCuidadorDto.prototype, "especialidades", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Dados bancários (JSON)', example: { banco: 'Nubank', agencia: '0001', conta: '123456-7' } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCuidadorDto.prototype, "dadosBancarios", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [documento_dto_1.DocumentoDto], description: 'Documentos do cuidador' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => documento_dto_1.DocumentoDto),
    __metadata("design:type", Array)
], CreateCuidadorDto.prototype, "documentos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: endereco_dto_1.EnderecoDto, description: 'Endereço do cuidador' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => endereco_dto_1.EnderecoDto),
    __metadata("design:type", endereco_dto_1.EnderecoDto)
], CreateCuidadorDto.prototype, "endereco", void 0);
//# sourceMappingURL=create-cuidador.dto.js.map