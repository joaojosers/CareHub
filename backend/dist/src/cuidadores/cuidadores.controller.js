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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuidadoresController = void 0;
const common_1 = require("@nestjs/common");
const cuidadores_service_1 = require("./cuidadores.service");
const create_cuidador_dto_1 = require("./dto/create-cuidador.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let CuidadoresController = class CuidadoresController {
    cuidadoresService;
    constructor(cuidadoresService) {
        this.cuidadoresService = cuidadoresService;
    }
    async create(createCuidadorDto) {
        return this.cuidadoresService.create(createCuidadorDto);
    }
    async findAll() {
        return this.cuidadoresService.findAll();
    }
    async findOne(id) {
        return this.cuidadoresService.findOne(id);
    }
    async getPacientes(id) {
        return this.cuidadoresService.findPacientesByCuidador(id);
    }
};
exports.CuidadoresController = CuidadoresController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-cadastro de novo cuidador (Público)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cadastro realizado com sucesso. Aguardando aprovação.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos ou e-mail já cadastrado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cuidador_dto_1.CreateCuidadorDto]),
    __metadata("design:returntype", Promise)
], CuidadoresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os cuidadores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de cuidadores retornada com sucesso.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CuidadoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar cuidador por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do usuário cuidador' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalhes do cuidador encontrados.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cuidador não encontrado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CuidadoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/pacientes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar pacientes vinculados a um cuidador específico' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CuidadoresController.prototype, "getPacientes", null);
exports.CuidadoresController = CuidadoresController = __decorate([
    (0, swagger_1.ApiTags)('Cuidadores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('cuidadores'),
    __metadata("design:paramtypes", [cuidadores_service_1.CuidadoresService])
], CuidadoresController);
//# sourceMappingURL=cuidadores.controller.js.map