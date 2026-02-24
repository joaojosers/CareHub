import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CuidadoresModule } from './cuidadores/cuidadores.module';
import { FamiliaresModule } from './familiares/familiares.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { PlantoesModule } from './plantoes/plantoes.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CuidadoresModule,
    FamiliaresModule,
    PacientesModule,
    PlantoesModule,
    PagamentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
