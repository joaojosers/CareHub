import { Controller, Get, Param, Patch, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuários (Admin)')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Listar usuários (todos ou por status)', description: 'Útil para ver quem está PENDENTE.' })
    @ApiQuery({ name: 'status', enum: UserStatus, required: false })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada.' })
    async findAll(
        @Query('status') status?: UserStatus,
        @Query('tipo') tipo?: UserRole // Adicione este Query param
    ) {
        return this.usersService.findAll(status, tipo);
    }

    @Get(':id') // 2º Busca por ID (Esta deve vir DEPOIS da listagem geral)
    findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
    }

    @Patch(':id/approve')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Aprovar cadastro de usuário' })
    @ApiParam({ name: 'id', description: 'ID do usuário' })
    @ApiResponse({ status: 200, description: 'Usuário aprovado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
    async approveUser(@Param('id') id: string) {
        return this.usersService.updateStatus(id, UserStatus.APROVADO);
    }

    @Patch(':id/reject')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Rejeitar cadastro de usuário' })
    @ApiParam({ name: 'id', description: 'ID do usuário' })
    @ApiResponse({ status: 200, description: 'Usuário rejeitado.' })
    async rejectUser(@Param('id') id: string) {
        return this.usersService.updateStatus(id, UserStatus.REJEITADO);
    }

}
