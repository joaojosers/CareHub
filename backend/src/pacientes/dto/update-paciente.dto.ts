import { PartialType } from '@nestjs/swagger';
import { CreatePacienteDto } from './pacientes.dto';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}