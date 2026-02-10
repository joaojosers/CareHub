import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/pacientes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('pacientes')
@UseGuards(JwtAuthGuard)
export class PacientesController {
    constructor(private readonly pacientesService: PacientesService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.FAMILIAR)
    async create(@Body() createPacienteDto: CreatePacienteDto) {
        return this.pacientesService.create(createPacienteDto);
    }

    @Get()
    async findAll() {
        return this.pacientesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.pacientesService.findOne(id);
    }
}
