"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePacienteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const pacientes_dto_1 = require("./pacientes.dto");
class UpdatePacienteDto extends (0, swagger_1.PartialType)(pacientes_dto_1.CreatePacienteDto) {
}
exports.UpdatePacienteDto = UpdatePacienteDto;
//# sourceMappingURL=update-paciente.dto.js.map