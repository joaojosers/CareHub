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
exports.PacientesController = void 0;
const common_1 = require("@nestjs/common");
const pacientes_service_1 = require("./pacientes.service");
const pacientes_dto_1 = require("./dto/pacientes.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const update_paciente_dto_1 = require("./dto/update-paciente.dto");
let PacientesController = class PacientesController {
    pacientesService;
    constructor(pacientesService) {
        this.pacientesService = pacientesService;
    }
    async create(createPacienteDto) {
        return this.pacientesService.create(createPacienteDto);
    }
    async findAll() {
        return this.pacientesService.findAll();
    }
    async findOne(id) {
        return this.pacientesService.findOne(id);
    }
    async update(id, updatePacienteDto) {
        return this.pacientesService.update(id, updatePacienteDto);
    }
    async vincularCuidador(id, dados) {
        return this.pacientesService.vincularCuidador(id, dados.cuidadorId, dados.valorHora);
    }
    async removerVinculo(vinculoId) {
        return this.pacientesService.removerVinculoCuidador(vinculoId);
    }
};
exports.PacientesController = PacientesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.FAMILIAR),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastrar novo paciente (Admin/Familiar)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Paciente cadastrado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pacientes_dto_1.CreatePacienteDto]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os pacientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pacientes retornada com sucesso.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar paciente por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalhes do paciente encontrados.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza dados de um paciente e seu endereço' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_paciente_dto_1.UpdatePacienteDto]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/vincular-cuidador'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Vincular um cuidador a um paciente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do paciente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cuidador vinculado com sucesso.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "vincularCuidador", null);
__decorate([
    (0, common_1.Delete)('vinculo-cuidador/:vinculoId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Remover vínculo entre cuidador e paciente' }),
    __param(0, (0, common_1.Param)('vinculoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacientesController.prototype, "removerVinculo", null);
exports.PacientesController = PacientesController = __decorate([
    (0, swagger_1.ApiTags)('Pacientes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('pacientes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pacientes_service_1.PacientesService])
], PacientesController);
//# sourceMappingURL=pacientes.controller.js.map