import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AutomotoresService } from '../services/automotores.service';
import { CreateAutomotoreDto } from '../dto/create-automotore.dto';
import { UpdateAutomotoreDto } from '../dto/update-automotore.dto';
import { VwAutomotoresConDueno } from '../../../entitites/VwAutomotoresConDueno.entity';
import { Automotores } from '../../../entitites/Automotores.entity';
import { ObjetoDeValor } from '../../../entitites/ObjetoDeValor.entity';
import { VinculoSujetoObjeto } from '../../../entitites/VinculoSujetoObjeto.entity';
import { Sujeto } from '../../../entitites/Sujeto.entity';
import { NotFoundException } from '@nestjs/common';

describe('AutomotoresService', () => {
  let service: AutomotoresService;
  let vwAutomotoresRepository: Repository<VwAutomotoresConDueno>;
  let automotoresRepository: Repository<Automotores>;
  let objetoDeValorRepository: Repository<ObjetoDeValor>;
  let vinculoSujetoObjetoRepository: Repository<VinculoSujetoObjeto>;
  let sujetoRepository: Repository<Sujeto>;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const mockSujeto = {
    spoId: 1,
    spoCuit: '20123456789',
    spoDenominacion: 'Test Sujeto',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockObjetoDeValor = {
    ovpId: 1,
    ovpTipo: 'AUTOMOTOR',
    ovpCodigo: 'ABC123',
    ovpDescripcion: 'Automotor ABC123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAutomotor = {
    atrId: 1,
    atrOvpId: 1,
    atrDominio: 'ABC123',
    atrNumeroChasis: 'CHASIS123',
    atrNumeroMotor: 'MOTOR123',
    atrColor: 'Rojo',
    atrFechaFabricacion: 202301,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVwAutomotoresConDueno = {
    atrId: 1,
    dominio: 'ABC123',
    numero_chasis: 'CHASIS123',
    numero_motor: 'MOTOR123',
    color: 'Rojo',
    fecha_fabricacion: 202301,
    spoId: 1,
    spoCuit: '20123456789',
    spoDenominacion: 'Test Sujeto',
  };

  const mockCreateAutomotoreDto: CreateAutomotoreDto = {
    dominio: 'ABC123',
    numero_chasis: 'CHASIS123',
    numero_motor: 'MOTOR123',
    color: 'Rojo',
    fecha_fabricacion: 202301,
    spoId: 1,
  };

  const mockUpdateAutomotoreDto: UpdateAutomotoreDto = {
    numero_chasis: 'CHASIS456',
    numero_motor: 'MOTOR456',
    color: 'Azul',
    fecha_fabricacion: 202302,
  };

  beforeEach(async () => {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const mockVwAutomotoresRepo = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
    };

    const mockAutomotoresRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockObjetoDeValorRepo = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockVinculoSujetoObjetoRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const mockSujetoRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutomotoresService,
        {
          provide: getRepositoryToken(VwAutomotoresConDueno),
          useValue: mockVwAutomotoresRepo,
        },
        {
          provide: getRepositoryToken(Automotores),
          useValue: mockAutomotoresRepo,
        },
        {
          provide: getRepositoryToken(ObjetoDeValor),
          useValue: mockObjetoDeValorRepo,
        },
        {
          provide: getRepositoryToken(VinculoSujetoObjeto),
          useValue: mockVinculoSujetoObjetoRepo,
        },
        {
          provide: getRepositoryToken(Sujeto),
          useValue: mockSujetoRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AutomotoresService>(AutomotoresService);
    vwAutomotoresRepository = module.get<Repository<VwAutomotoresConDueno>>(getRepositoryToken(VwAutomotoresConDueno));
    automotoresRepository = module.get<Repository<Automotores>>(getRepositoryToken(Automotores));
    objetoDeValorRepository = module.get<Repository<ObjetoDeValor>>(getRepositoryToken(ObjetoDeValor));
    vinculoSujetoObjetoRepository = module.get<Repository<VinculoSujetoObjeto>>(getRepositoryToken(VinculoSujetoObjeto));
    sujetoRepository = module.get<Repository<Sujeto>>(getRepositoryToken(Sujeto));
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = mockQueryRunner as unknown as QueryRunner;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated automotores', async () => {
      const mockData = [mockVwAutomotoresConDueno];
      const mockTotal = 1;
      const paginationDto = { page: 1, limit: 10 };

      jest.spyOn(vwAutomotoresRepository, 'findAndCount').mockResolvedValue([mockData as unknown as VwAutomotoresConDueno[], mockTotal]);

      const result = await service.findAll(paginationDto);

      expect(result.data).toEqual(mockData as unknown as VwAutomotoresConDueno[]);
      expect(result.total).toBe(mockTotal);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(vwAutomotoresRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
    });
  });

  describe('create', () => {
    it('should create a new automotor successfully', async () => {
      jest.spyOn(sujetoRepository, 'findOne').mockResolvedValue(mockSujeto as any);
      jest.spyOn(automotoresRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(objetoDeValorRepository, 'create').mockReturnValue(mockObjetoDeValor as any);
      jest.spyOn(objetoDeValorRepository, 'save').mockResolvedValue(mockObjetoDeValor as any);
      jest.spyOn(automotoresRepository, 'create').mockReturnValue(mockAutomotor as any);
      jest.spyOn(automotoresRepository, 'save').mockResolvedValue(mockAutomotor as any);
      jest.spyOn(vinculoSujetoObjetoRepository, 'find').mockResolvedValue([]);
      jest.spyOn(vinculoSujetoObjetoRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(vinculoSujetoObjetoRepository, 'save').mockResolvedValue({} as any);
      jest.spyOn(vwAutomotoresRepository, 'findOne').mockResolvedValue(mockVwAutomotoresConDueno as any);

      const result = await service.create(mockCreateAutomotoreDto);

      expect(result).toEqual(mockVwAutomotoresConDueno);
      expect(sujetoRepository.findOne).toHaveBeenCalledWith({ where: { spoId: mockCreateAutomotoreDto.spoId } });
      expect(automotoresRepository.findOne).toHaveBeenCalledWith({ where: { atrDominio: mockCreateAutomotoreDto.dominio } });
      expect(objetoDeValorRepository.create).toHaveBeenCalledWith({
        ovpTipo: 'AUTOMOTOR',
        ovpCodigo: mockCreateAutomotoreDto.dominio,
        ovpDescripcion: `Automotor ${mockCreateAutomotoreDto.dominio}`
      });
      expect(automotoresRepository.create).toHaveBeenCalledWith({
        atrOvpId: mockObjetoDeValor.ovpId,
        atrDominio: mockCreateAutomotoreDto.dominio,
        atrNumeroChasis: mockCreateAutomotoreDto.numero_chasis,
        atrNumeroMotor: mockCreateAutomotoreDto.numero_motor,
        atrColor: mockCreateAutomotoreDto.color,
        atrFechaFabricacion: mockCreateAutomotoreDto.fecha_fabricacion
      });
    });
  });

  describe('remove', () => {
    it('should remove an automotor successfully', async () => {
      const dominio = 'ABC123';
      jest.spyOn(automotoresRepository, 'findOne').mockResolvedValue(mockAutomotor as any);
      jest.spyOn(objetoDeValorRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(dominio);

      expect(result).toEqual({ message: 'Automotor eliminado correctamente' });
      expect(automotoresRepository.findOne).toHaveBeenCalledWith({ where: { atrDominio: dominio } });
      expect(objetoDeValorRepository.delete).toHaveBeenCalledWith({ ovpId: mockAutomotor.atrOvpId });
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when automotor does not exist', async () => {
      const dominio = 'XYZ789';
      jest.spyOn(automotoresRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(dominio)).rejects.toThrow(NotFoundException);
      await expect(service.remove(dominio)).rejects.toThrow('No se encontró un automotor con ese dominio');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

  });

});

});
