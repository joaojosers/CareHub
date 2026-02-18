import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/pacientes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

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
}
