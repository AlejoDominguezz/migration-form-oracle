import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateSujetoDto } from '../dto/create-sujeto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sujeto } from '../../../entitites/Sujeto.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class SujetosService {
  constructor(
    @InjectRepository(Sujeto)
    private sujetoRepository: Repository<Sujeto>,
    private dataSource: DataSource,
  ) {}

  async create(createSujetoDto: CreateSujetoDto, transaction?: QueryRunner) : Promise<Sujeto> {
    const queryRunner = transaction ?? this.dataSource.createQueryRunner();
    
    if (!this.isCuitValid(createSujetoDto.spoCuit)) {
      throw new UnprocessableEntityException('El CUIT es invalido.');
    }

    const existsCuit = await this.sujetoRepository.findOne({ where: { spoCuit: createSujetoDto.spoCuit } });
    if (existsCuit) {
      throw new UnprocessableEntityException('El CUIT ya existe.');
    }

   try {

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const sujeto = this.sujetoRepository.create({
      spoCuit: createSujetoDto.spoCuit,
      spoDenominacion: createSujetoDto.spoDenominacion
    });
    
    await this.sujetoRepository.save(sujeto);

    if (!transaction) await queryRunner.commitTransaction();

    return sujeto;
   } catch (error) {
    if (!transaction) await queryRunner.rollbackTransaction();
      throw error;
   }finally {
    if (!transaction) await queryRunner.release();
   }
  }

  async findOne(cuit: string) : Promise<Sujeto> {
    try {
      const sujeto = await this.sujetoRepository.findOne({ where: { spoCuit: cuit } });

      if (!sujeto) {
        throw new NotFoundException('Sujeto not found');
      }

      return sujeto;
    }
    catch (error) {
      throw error;
    }
  } 


  private isCuitValid(cuit: string): boolean {
    
    if (!cuit || cuit.length !== 11 || !/^[0-9]{11}$/.test(cuit)) {
      return false;
    }

    const coeficients = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 10; i++) {
      suma += parseInt(cuit[i]) * coeficients[i];
    }

    let digitVerifier = (11 - (suma % 11)) % 11;
    if (digitVerifier === 11) {
      digitVerifier = 0;
    }

    return digitVerifier === parseInt(cuit[10]);
  }

}
