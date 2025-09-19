import { Injectable, BadRequestException, NotFoundException , UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { UpdateAutomotoreDto } from '../dto/update-automotore.dto';
import { CreateAutomotoreDto } from '../dto/create-automotore.dto';
import { VwAutomotoresConDueno } from '../../../entitites/VwAutomotoresConDueno.entity';
import { PaginationDto, PaginatedResponseDto } from '../../../helpers/dto';
import { Automotores } from '../../../entitites/Automotores.entity';
import { ObjetoDeValor } from '../../../entitites/ObjetoDeValor.entity';
import { VinculoSujetoObjeto } from '../../../entitites/VinculoSujetoObjeto.entity';
import { Sujeto } from '../../../entitites/Sujeto.entity';
import { AutomotorValidators } from '../../../helpers/validators/automotor.validators';

@Injectable()
export class AutomotoresService {
  constructor(
    @InjectRepository(VwAutomotoresConDueno)
    private readonly vwAutomotoresRepository: Repository<VwAutomotoresConDueno>,
    @InjectRepository(Automotores)
    private readonly automotoresRepository: Repository<Automotores>,
    @InjectRepository(ObjetoDeValor)
    private readonly objetoDeValorRepository: Repository<ObjetoDeValor>,
    @InjectRepository(VinculoSujetoObjeto)
    private readonly vinculoSujetoObjetoRepository: Repository<VinculoSujetoObjeto>,
    @InjectRepository(Sujeto)
    private readonly sujetoRepository: Repository<Sujeto>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createAutomotoreDto: CreateAutomotoreDto, transaction?: QueryRunner): Promise<VwAutomotoresConDueno> {

    const queryRunner = transaction ?? this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { dominio, numero_chasis, numero_motor, color, fecha_fabricacion, spoId } = createAutomotoreDto;

    if (!AutomotorValidators.validateDominio(dominio)) {
      throw new UnprocessableEntityException('Formato de dominio inválido. Debe ser AAA000 o AA000AA');
    }

    if (!AutomotorValidators.validateFechaFabricacion(fecha_fabricacion)) {
      throw new UnprocessableEntityException('Fecha de fabricación inválida. Debe ser YYYYMM y estar entre 190001 y la fecha actual');
    }


    try {

      const sujeto = await this.sujetoRepository.findOne({
        where: { spoId }
      });
  
      if (!sujeto) {
        throw new NotFoundException('No existe un sujeto con el ID proporcionado');
      }
  
      const automotorExistente = await this.automotoresRepository.findOne({
        where: { atrDominio: dominio }
      });
  
      if (automotorExistente) {
        throw new BadRequestException('Ya existe un automotor con ese dominio');
      }
  
      const objetoDeValor = this.objetoDeValorRepository.create({
          ovpTipo: 'AUTOMOTOR',
          ovpCodigo: dominio,
          ovpDescripcion: `Automotor ${dominio}`
        });
  
        const savedObjetoDeValor = await this.objetoDeValorRepository.save(objetoDeValor);
  
        const automotor = this.automotoresRepository.create({
          atrOvpId: savedObjetoDeValor.ovpId,
          atrDominio: dominio,
          atrNumeroChasis: numero_chasis,
          atrNumeroMotor: numero_motor,
          atrColor: color,
          atrFechaFabricacion: fecha_fabricacion
        });
        await this.automotoresRepository.save(automotor);
  
         const vinculosAnteriores = await this.vinculoSujetoObjetoRepository.find({
           where: {
             vsoOvpId: savedObjetoDeValor.ovpId,
             vsoResponsable: 'S',
             vsoFechaFin: null
           }
         });

         for (const vinculo of vinculosAnteriores) {
           vinculo.vsoFechaFin = new Date();
           await this.vinculoSujetoObjetoRepository.save(vinculo);
         }

         const vinculo = this.vinculoSujetoObjetoRepository.create({
           vsoOvpId: savedObjetoDeValor.ovpId,
           vsoSpoId: spoId,
           vsoTipoVinculo: 'DUENO',
           vsoPorcentaje: 100,
           vsoResponsable: 'S',
           vsoFechaInicio: new Date()
         });
         await this.vinculoSujetoObjetoRepository.save(vinculo);

        if (!transaction) await queryRunner.commitTransaction();

        return await this.vwAutomotoresRepository.findOne({
          where: { dominio }
        });

    } catch (error) {
      if (!transaction) await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      if (!transaction) await queryRunner.release();
    }

    
    
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponseDto<VwAutomotoresConDueno>> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;
  
      const [data, total] = await this.vwAutomotoresRepository.findAndCount({
        skip,
        take: limit,
      });
  
      return new PaginatedResponseDto(data, total, page, limit);
      
    } catch (error) {
      throw error;
    }
  }

  async findOne(dominio: string): Promise<VwAutomotoresConDueno | null> {
    return this.vwAutomotoresRepository.findOne({
      where: { dominio }
    });
  }

  async update(dominio: string, updateAutomotoreDto: UpdateAutomotoreDto, transaction?: QueryRunner): Promise<VwAutomotoresConDueno> {
    
    const queryRunner = transaction ?? this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { numero_chasis, numero_motor, color, fecha_fabricacion, spoId } = updateAutomotoreDto;

    if (fecha_fabricacion && !AutomotorValidators.validateFechaFabricacion(fecha_fabricacion)) {
      throw new BadRequestException('Fecha de fabricación inválida. Debe ser YYYYMM y estar entre 190001 y la fecha actual');
    }

    try {

      const automotor = await this.automotoresRepository.findOne({
        where: { atrDominio: dominio },
        relations: ['atrOvp']
      });

      if (!automotor) {
        throw new NotFoundException('No se encontró un automotor con ese dominio');
      }


      const newPayload = Object.assign(new Automotores(), automotor , { atrNumeroChasis: numero_chasis, 
        atrNumeroMotor: numero_motor, atrColor: color, atrFechaFabricacion: fecha_fabricacion });

      await this.automotoresRepository.save(newPayload);

      
      if (spoId) {
        
        const vinculoActual = await this.vinculoSujetoObjetoRepository.findOne({
          where: {
            vsoOvpId: automotor.atrOvpId,
            vsoResponsable: 'S',
            vsoFechaFin: null
          }
        });


        if (vinculoActual.vsoSpoId !== spoId) {
          
          const vinculosAnteriores = await this.vinculoSujetoObjetoRepository.find({
            where: {
              vsoOvpId: automotor.atrOvpId,
              vsoResponsable: 'S',
              vsoFechaFin: null
            }
          });

          
          for (const vinculo of vinculosAnteriores) {
            vinculo.vsoFechaFin = new Date();
            await this.vinculoSujetoObjetoRepository.save(vinculo);
          }

          
          const vinculo = this.vinculoSujetoObjetoRepository.create({
            vsoOvpId: automotor.atrOvpId,
            vsoSpoId: spoId,
            vsoTipoVinculo: 'DUENO',
            vsoPorcentaje: 100,
            vsoResponsable: 'S',
            vsoFechaInicio: new Date()
          });
          await this.vinculoSujetoObjetoRepository.save(vinculo);
        }
      }

      if (!transaction) await queryRunner.commitTransaction();

      return await this.vwAutomotoresRepository.findOne({
        where: { dominio }
      });

    } catch (error) {
      if (!transaction) await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      if (!transaction) await queryRunner.release();
    }
  }

  async remove(dominio: string , transaction?: QueryRunner): Promise<{ message: string }> {

    const queryRunner = transaction ?? this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const automotor = await this.automotoresRepository.findOne({
        where: { atrDominio: dominio }
      });
  
      if (!automotor) {
        throw new NotFoundException('No se encontró un automotor con ese dominio');
      }
  
      await this.objetoDeValorRepository.delete({ ovpId: automotor.atrOvpId });
  
      if (!transaction) await queryRunner.commitTransaction();

      return { message: 'Automotor eliminado correctamente' };

    } catch (error) {
      if (!transaction) await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      if (!transaction) await queryRunner.release();
    }
  }

  
}
