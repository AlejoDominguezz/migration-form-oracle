import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SujetosService } from '../services/sujetos.service';
import { CreateSujetoDto } from '../dto/create-sujeto.dto';

@Controller('sujetos')
export class SujetosController {
  constructor(private readonly sujetosService: SujetosService) {}

  @Post()
  create(@Body() createSujetoDto: CreateSujetoDto) {
    return this.sujetosService.create(createSujetoDto);
  }

  @Get('by-cuit')
  findOne(@Query('cuit') cuit: string) {
    return this.sujetosService.findOne(cuit);
  }
}
