import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateAutomotoreDto } from '../dto/create-automotore.dto';
import { AutomotoresService } from '../services/automotores.service';
import { UpdateAutomotoreDto } from '../dto/update-automotore.dto';
import { PaginationDto } from '../../../helpers/dto';

@Controller('automotores')
export class AutomotoresController {
  constructor(private readonly automotoresService: AutomotoresService) {}

  @Post()
  create(@Body() createAutomotoreDto: CreateAutomotoreDto) {
    return this.automotoresService.create(createAutomotoreDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.automotoresService.findAll(paginationDto);
  }

  @Get(':dominio')
  findOne(@Param('dominio') dominio: string) {
    return this.automotoresService.findOne(dominio);
  }

  @Put(':dominio')
  update(@Param('dominio') dominio: string, @Body() updateAutomotoreDto: UpdateAutomotoreDto) {
    return this.automotoresService.update(dominio, updateAutomotoreDto);
  }

  @Delete(':dominio')
  remove(@Param('dominio') dominio: string) {
    return this.automotoresService.remove(dominio);
  }
}
