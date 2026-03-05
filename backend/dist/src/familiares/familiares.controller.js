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
exports.FamiliaresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const familiares_service_1 = require("./familiares.service");
const vincular_paciente_dto_1 = require("./dto/vincular-paciente.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let FamiliaresController = class FamiliaresController {
    familiaresService;
    constructor(familiaresService) {
        this.familiaresService = familiaresService;
    }
    async vincular(req, dto) {
        const targetUserId = req.user.role === client_1.UserRole.ADMIN
            ? dto.userId
            : req.user.userId;
        return this.familiaresService.vincularPaciente(targetUserId, dto);
    }
    async getMeusPacientes(req) {
        return this.familiaresService.findMeusPacientes(req.user.userId);
    }
};
exports.FamiliaresController = FamiliaresController;
__decorate([
    (0, common_1.Post)('vincular'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.FAMILIAR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Vincula um paciente a um usuário familiar' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vínculo criado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paciente não encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Vínculo já existente.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vincular_paciente_dto_1.VincularPacienteDto]),
    __metadata("design:returntype", Promise)
], FamiliaresController.prototype, "vincular", null);
__decorate([
    (0, common_1.Get)('meus-pacientes'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.FAMILIAR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os pacientes vinculados ao usuário logado' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamiliaresController.prototype, "getMeusPacientes", null);
exports.FamiliaresController = FamiliaresController = __decorate([
    (0, swagger_1.ApiTags)('familiares'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('familiares'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [familiares_service_1.FamiliaresService])
], FamiliaresController);
//# sourceMappingURL=familiares.controller.js.map