import { Module } from '@nestjs/common';
import { SujetosService } from './services/sujetos.service';
import { SujetosController } from './controllers/sujetos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sujeto } from 'src/entitites/Sujeto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sujeto])],
  controllers: [SujetosController],
  providers: [SujetosService],
})
export class SujetosModule {}
