import { Module } from '@nestjs/common';
import { FamiliaresController } from './familiares.controller';
import { FamiliaresService } from './familiares.service';

@Module({
  controllers: [FamiliaresController],
  providers: [FamiliaresService]
})
export class FamiliaresModule { }
