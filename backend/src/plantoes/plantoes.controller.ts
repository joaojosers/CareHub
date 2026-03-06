import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PlantoesService } from './plantoes.service';
import { CreatePlantaoDto } from './dto/create-plantao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PlantaoStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Plantões')
@ApiBearerAuth()
@Controller('plantoes')
@UseGuards(JwtAuthGuard)
export class PlantoesController {
    constructor(private readonly plantoesService: PlantoesService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.CUIDADOR)
    @ApiOperation({ summary: 'Criar/Agendar novo plantão' })
    @ApiResponse({ status: 201, description: 'Plantão criado com sucesso.' })
    @ApiResponse({ status: 403, description: 'Permissão negada (Somente Admin/Familiar).' })
    async create(@Body() dto: CreatePlantaoDto) {
        return this.plantoesService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Listar todos os plantões (Básico)' })
    async findAll() {
        return this.plantoesService.findAll();
    }

    @Get('meus-plantoes')
    @ApiOperation({ summary: 'Listar plantões do usuário logado (Cuidador/Familiar)' })
    async findMyPlantoes(@Request() req) {
        if (req.user.role === UserRole.CUIDADOR) {
            return this.plantoesService.findByCuidador(req.user.userId);
        } else if (req.user.role === UserRole.FAMILIAR) {
            return this.plantoesService.findByFamiliar(req.user.userId);
        }
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Alterar status do plantão (Aprovar/Rejeitar/Cancelar)' })
    @ApiParam({ name: 'id', description: 'ID do plantão' })
    @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', example: 'APROVADO' } } } })
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: PlantaoStatus
    ) {
        return this.plantoesService.updateStatus(id, status);
    }
}
