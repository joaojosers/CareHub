import { Controller, Post, Get, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { CuidadoresService } from './cuidadores.service';
import { CreateCuidadorDto } from './dto/create-cuidador.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator'; // <--- O novo import aqui
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Cuidadores')
@ApiBearerAuth() // Indica que todas as rotas precisam do Token
@Controller('cuidadores')
export class CuidadoresController {
    constructor(private readonly cuidadoresService: CuidadoresService) { }

    @Public()
    @Post()
    @ApiOperation({ summary: 'Auto-cadastro de novo cuidador (Público)' })
    @ApiResponse({ status: 201, description: 'Cadastro realizado com sucesso. Aguardando aprovação.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou e-mail já cadastrado.' })
    async create(@Body() createCuidadorDto: CreateCuidadorDto) {
        // O seu Service já deve setar o status como 'PENDENTE' por padrão
        return this.cuidadoresService.create(createCuidadorDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard) // Só o admin pode listar todos os cuidadores
    @Roles(UserRole.ADMIN)
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

    @Get(':id/pacientes')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Listar pacientes vinculados a um cuidador específico' })
    async getPacientes(@Param('id') id: string) {
        return this.cuidadoresService.findPacientesByCuidador(id);
    }
}
