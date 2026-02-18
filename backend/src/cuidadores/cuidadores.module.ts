import { Module } from '@nestjs/common';
import { CuidadoresController } from './cuidadores.controller';
import { CuidadoresService } from './cuidadores.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CuidadoresController],
  providers: [CuidadoresService]
})
export class CuidadoresModule { }
