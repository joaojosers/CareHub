"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlantoesModule = void 0;
const common_1 = require("@nestjs/common");
const plantoes_service_1 = require("./plantoes.service");
const plantoes_controller_1 = require("./plantoes.controller");
const database_module_1 = require("../database/database.module");
const pagamentos_module_1 = require("../pagamentos/pagamentos.module");
let PlantoesModule = class PlantoesModule {
};
exports.PlantoesModule = PlantoesModule;
exports.PlantoesModule = PlantoesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, pagamentos_module_1.PagamentosModule],
        providers: [plantoes_service_1.PlantoesService],
        controllers: [plantoes_controller_1.PlantoesController]
    })
], PlantoesModule);
//# sourceMappingURL=plantoes.module.js.map