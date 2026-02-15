import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Realizar login e obter token JWT' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Retorna o token de acesso.' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.senha);

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha incorretos');
        }

        return this.authService.login(user);
    }
}
