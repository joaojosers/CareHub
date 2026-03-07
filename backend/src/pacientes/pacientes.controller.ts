import { Controller, Post, Get, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/pacientes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UpdatePacienteDto } from './dto/update-paciente.dto';


@ApiTags('Pacientes')
@ApiBearerAuth()
@Controller('pacientes')
@UseGuards(JwtAuthGuard)
export class PacientesController {
    constructor(private readonly pacientesService: PacientesService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.FAMILIAR)
    @ApiOperation({ summary: 'Cadastrar novo paciente (Admin/Familiar)' })
    @ApiResponse({ status: 201, description: 'Paciente cadastrado com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    async create(@Body() createPacienteDto: CreatePacienteDto) {
        return this.pacientesService.create(createPacienteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os pacientes' })
    @ApiResponse({ status: 200, description: 'Lista de pacientes retornada com sucesso.' })
    async findAll() {
        return this.pacientesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar paciente por ID' })
    @ApiParam({ name: 'id', description: 'ID do paciente' })
    @ApiResponse({ status: 200, description: 'Detalhes do paciente encontrados.' })
    @ApiResponse({ status: 404, description: 'Paciente não encontrado.' })
    async findOne(@Param('id') id: string) {
        return this.pacientesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza dados de um paciente e seu endereço' })
    async update(
    @Param('id') id: string, 
    @Body() updatePacienteDto: UpdatePacienteDto
)   {
    return this.pacientesService.update(id, updatePacienteDto);
    }

    @Post(':id/vincular-cuidador')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN) // Apenas Admin vincula
    @ApiOperation({ summary: 'Vincular um cuidador a um paciente' })
    @ApiParam({ name: 'id', description: 'ID do paciente' })
    @ApiResponse({ status: 201, description: 'Cuidador vinculado com sucesso.' })
    async vincularCuidador(
        @Param('id') id: string,
        @Body() dados: { cuidadorId: string; valorHora: number }
    ) {
        return this.pacientesService.vincularCuidador(id, dados.cuidadorId, dados.valorHora);
    }
    
    @Delete('vinculo-cuidador/:vinculoId')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Remover vínculo entre cuidador e paciente' })
    async removerVinculo(@Param('vinculoId') vinculoId: string) {
  return this.pacientesService.removerVinculoCuidador(vinculoId);
    }
}
