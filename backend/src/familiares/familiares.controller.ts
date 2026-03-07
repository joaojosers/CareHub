import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FamiliaresService } from './familiares.service';
import { VincularPacienteDto } from './dto/vincular-paciente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('familiares') // Define a categoria no Swagger
@ApiBearerAuth() // Indica que a rota exige token JWT no Swagger
@Controller('familiares')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FamiliaresController {
  constructor(private readonly familiaresService: FamiliaresService) {}

  @Post('vincular')
  @Roles(UserRole.FAMILIAR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Vincula um paciente a um usuário familiar' })
  @ApiResponse({ status: 201, description: 'Vínculo criado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Paciente não encontrado.' })
  @ApiResponse({ status: 409, description: 'Vínculo já existente.' })
  async vincular(@Request() req, @Body() dto: VincularPacienteDto) {
    /**
     * LÓGICA DE TARGET:
     * Se o usuário logado for ADMIN, ele pode vincular qualquer userId (vindo do DTO).
     * Se for FAMILIAR, ele só pode vincular a si mesmo (usando o ID do Token).
     */
    const targetUserId = req.user.role === UserRole.ADMIN 
      ? dto.userId 
      : req.user.userId;

    return this.familiaresService.vincularPaciente(targetUserId, dto);
  }

  @Get('meus-pacientes')
  @Roles(UserRole.FAMILIAR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Lista todos os pacientes vinculados ao usuário logado' })
  async getMeusPacientes(@Request() req) {
    // Aqui usamos sempre o ID do token, pois o familiar quer ver os "seus" pacientes
    return this.familiaresService.findMeusPacientes(req.user.userId);
  }
}
