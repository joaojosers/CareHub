import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CuidadoresService } from './cuidadores.service';
import { CreateCuidadorDto } from './dto/create-cuidador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('cuidadores')
export class CuidadoresController {
    constructor(private readonly cuidadoresService: CuidadoresService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN) // Apenas administradores podem criar novos cuidadores
    async create(@Body() createCuidadorDto: CreateCuidadorDto) {
        return this.cuidadoresService.create(createCuidadorDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard) // Qualquer usuário logado pode listar cuidadores
    async findAll() {
        return this.cuidadoresService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
        return this.cuidadoresService.findOne(id);
    }
}
