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
exports.PagamentosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pagamentos_service_1 = require("./pagamentos.service");
const create_pagamento_dto_1 = require("./dto/create-pagamento.dto");
const confirmar_pagamento_dto_1 = require("./dto/confirmar-pagamento.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PagamentosController = class PagamentosController {
    pagamentosService;
    constructor(pagamentosService) {
        this.pagamentosService = pagamentosService;
    }
    async create(dto) {
        return this.pagamentosService.create(dto);
    }
    async findAll(mes, status, cuidadorId) {
        return this.pagamentosService.findAll(mes, status, cuidadorId);
    }
    async gerarRelatorio(mes) {
        return this.pagamentosService.gerarRelatorio(mes);
    }
    async findById(id) {
        return this.pagamentosService.findById(id);
    }
    async marcarComoProcessado(id) {
        return this.pagamentosService.marcarComoProcessado(id);
    }
    async confirmarPagamento(id, dto) {
        return this.pagamentosService.confirmarPagamento(id, dto);
    }
    async delete(id) {
        return this.pagamentosService.delete(id);
    }
    async findMy(req) {
        const cuidadorId = req.user.cuidadorId;
        return this.pagamentosService.findMy(cuidadorId);
    }
};
exports.PagamentosController = PagamentosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Criar pagamento para um plantão (Admin)',
        description: 'Cria um pagamento para um plantão APROVADO. Calcula automaticamente valorBruto, taxaPlataforma (10%) e valorLiquido.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Pagamento criado com sucesso',
        schema: {
            example: {
                id: 'uuid',
                plantaoId: 'uuid-plantao',
                cuidadorId: 'uuid-cuidador',
                valorBruto: 160.0,
                taxaPlataforma: 16.0,
                valorLiquido: 144.0,
                status: 'PENDENTE',
                metodoPagamento: 'PIX',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Plantão não aprovado ou sem cuidador' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plantão não encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Pagamento já existe para este plantão' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pagamento_dto_1.CreatePagamentoDto]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos os pagamentos (Admin)',
        description: 'Lista pagamentos com filtros opcionais por mês, status e cuidador',
    }),
    (0, swagger_1.ApiQuery)({ name: 'mes', required: false, example: '2026-02', description: 'Mês (YYYY-MM)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.PagamentoStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'cuidadorId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pagamentos retornada' }),
    __param(0, (0, common_1.Query)('mes')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('cuidadorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('relatorio/:mes'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Relatório financeiro mensal (Admin)',
        description: 'Gera relatório com totais bruto/líquido, taxa da plataforma e breakdown por cuidador',
    }),
    (0, swagger_1.ApiParam)({ name: 'mes', description: 'Mês (YYYY-MM)', example: '2026-02' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Relatório gerado com sucesso',
        schema: {
            example: {
                mes: '2026-02',
                totalPagamentos: 3,
                totalCuidadores: 2,
                totalHoras: 24,
                totalBruto: 480.0,
                totalLiquido: 432.0,
                totalTaxaPlataforma: 48.0,
                porStatus: { PENDENTE: 2, PROCESSADO: 1, PAID: 0 },
                detalhes: [],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Nenhum pagamento encontrado' }),
    __param(0, (0, common_1.Param)('mes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "gerarRelatorio", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhes de um pagamento (Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento retornado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/processar'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Processar pagamento (Admin)',
        description: 'Transição PENDENTE → PROCESSADO. Indica que o pagamento está pronto para transferência.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento marcado como PROCESSADO' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Pagamento não está em status PENDENTE' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "marcarComoProcessado", null);
__decorate([
    (0, common_1.Patch)(':id/confirmar-pagamento'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirmar pagamento com comprovante (Admin)',
        description: 'Transição PROCESSADO → PAID. Registra comprovante e data do pagamento.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento confirmado como PAID' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Pagamento não está em status PROCESSADO' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, confirmar_pagamento_dto_1.ConfirmarPagamentoDto]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "confirmarPagamento", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Deletar pagamento (Admin)',
        description: 'Remove um pagamento. Apenas pagamentos PENDENTE podem ser deletados.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID do pagamento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pagamento deletado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Apenas PENDENTE podem ser deletados' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Pagamento não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('meus-pagamentos'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CUIDADOR),
    (0, swagger_1.ApiOperation)({
        summary: 'Meus pagamentos (Cuidador)',
        description: 'Lista os pagamentos do cuidador autenticado, com detalhes do plantão e paciente.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de pagamentos do cuidador' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PagamentosController.prototype, "findMy", null);
exports.PagamentosController = PagamentosController = __decorate([
    (0, swagger_1.ApiTags)('Pagamentos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('pagamentos'),
    __metadata("design:paramtypes", [pagamentos_service_1.PagamentosService])
], PagamentosController);
//# sourceMappingURL=pagamentos.controller.js.map