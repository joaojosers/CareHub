import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CuidadoresService } from './cuidadores.service';
import { CreateCuidadorDto } from './dto/create-cuidador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Cuidadores')
@ApiBearerAuth() // Indica que todas as rotas precisam do Token
@Controller('cuidadores')
export class CuidadoresController {
    constructor(private readonly cuidadoresService: CuidadoresService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN) // Apenas administradores podem criar novos cuidadores
    @ApiOperation({ summary: 'Criar um novo cuidador (Admin)' })
    @ApiResponse({ status: 201, description: 'Cuidador criado com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado (Somente Admin).' })
    async create(@Body() createCuidadorDto: CreateCuidadorDto) {
        return this.cuidadoresService.create(createCuidadorDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard) // Qualquer usuário logado pode listar cuidadores
    @ApiOperation({ summary: 'Listar todos os cuidadores' })
    @ApiResponse({ status: 200, description: 'Lista de cuidadores retornada com sucesso.' })
    async findAll() {
        return this.cuidadoresService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Buscar cuidador por ID' })
    @ApiParam({ name: 'id', description: 'ID do usuário cuidador' })
    @ApiResponse({ status: 200, description: 'Detalhes do cuidador encontrados.' })
    @ApiResponse({ status: 404, description: 'Cuidador não encontrado.' })
    async findOne(@Param('id') id: string) {
        return this.cuidadoresService.findOne(id);
    }
}
