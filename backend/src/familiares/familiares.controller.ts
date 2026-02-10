import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { FamiliaresService } from './familiares.service';
import { VincularPacienteDto } from './dto/vincular-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('familiares')
@UseGuards(JwtAuthGuard)
export class FamiliaresController {
    constructor(private readonly familiaresService: FamiliaresService) { }

    @Post('vincular')
    @UseGuards(RolesGuard)
    @Roles(UserRole.FAMILIAR, UserRole.ADMIN)
    async vincular(@Request() req, @Body() dto: VincularPacienteDto) {
        return this.familiaresService.vincularPaciente(req.user.userId, dto);
    }

    @Get('meus-pacientes')
    async getMeusPacientes(@Request() req) {
        return this.familiaresService.findMeusPacientes(req.user.userId);
    }
}
