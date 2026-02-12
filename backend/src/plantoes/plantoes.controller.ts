import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PlantoesService } from './plantoes.service';
import { CreatePlantaoDto } from './dto/create-plantao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PlantaoStatus } from '@prisma/client';

@Controller('plantoes')
@UseGuards(JwtAuthGuard)
export class PlantoesController {
    constructor(private readonly plantoesService: PlantoesService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.FAMILIAR)
    async create(@Body() dto: CreatePlantaoDto) {
        return this.plantoesService.create(dto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAll() {
        return this.plantoesService.findAll();
    }

    @Get('meus-plantoes')
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
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: PlantaoStatus
    ) {
        return this.plantoesService.updateStatus(id, status);
    }
}
