import { Module } from '@nestjs/common';
import { FamiliaresController } from './familiares.controller';
import { FamiliaresService } from './familiares.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FamiliaresController],
  providers: [FamiliaresService]
})
export class FamiliaresModule { }
