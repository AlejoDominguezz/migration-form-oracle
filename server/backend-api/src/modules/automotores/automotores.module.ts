import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VwAutomotoresConDueno } from '../../entitites/VwAutomotoresConDueno.entity';
import { Automotores } from '../../entitites/Automotores.entity';
import { ObjetoDeValor } from '../../entitites/ObjetoDeValor.entity';
import { VinculoSujetoObjeto } from '../../entitites/VinculoSujetoObjeto.entity';
import { Sujeto } from '../../entitites/Sujeto.entity';
import { AutomotoresController } from './controllers/automotores.controller';
import { AutomotoresService } from './services/automotores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VwAutomotoresConDueno,
      Automotores,
      ObjetoDeValor,
      VinculoSujetoObjeto,
      Sujeto
    ])
  ],
  controllers: [AutomotoresController],
  providers: [AutomotoresService],
})
export class AutomotoresModule {}
