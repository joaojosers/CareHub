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
exports.PlantoesController = void 0;
const common_1 = require("@nestjs/common");
const plantoes_service_1 = require("./plantoes.service");
const create_plantao_dto_1 = require("./dto/create-plantao.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let PlantoesController = class PlantoesController {
    plantoesService;
    constructor(plantoesService) {
        this.plantoesService = plantoesService;
    }
    async create(dto) {
        return this.plantoesService.create(dto);
    }
    async findAll() {
        return this.plantoesService.findAll();
    }
    async findMyPlantoes(req) {
        if (req.user.role === client_1.UserRole.CUIDADOR) {
            return this.plantoesService.findByCuidador(req.user.userId);
        }
        else if (req.user.role === client_1.UserRole.FAMILIAR) {
            return this.plantoesService.findByFamiliar(req.user.userId);
        }
    }
    async updateStatus(id, status) {
        return this.plantoesService.aprovarPlantao(id);
    }
};
exports.PlantoesController = PlantoesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.CUIDADOR),
    (0, swagger_1.ApiOperation)({ summary: 'Criar/Agendar novo plantão' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plantão criado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Permissão negada (Somente Admin/Familiar).' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plantao_dto_1.CreatePlantaoDto]),
    __metadata("design:returntype", Promise)
], PlantoesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os plantões (Básico)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlantoesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('meus-plantoes'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar plantões do usuário logado (Cuidador/Familiar)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlantoesController.prototype, "findMyPlantoes", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Alterar status do plantão (Aprovar/Rejeitar/Cancelar)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do plantão' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { status: { type: 'string', example: 'APROVADO' } } } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlantoesController.prototype, "updateStatus", null);
exports.PlantoesController = PlantoesController = __decorate([
    (0, swagger_1.ApiTags)('Plantões'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('plantoes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [plantoes_service_1.PlantoesService])
], PlantoesController);
//# sourceMappingURL=plantoes.controller.js.map