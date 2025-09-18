import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Sujeto } from '../../../entitites/Sujeto.entity';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { SujetosService } from '../services/sujetos.service';
import { CreateSujetoDto } from '../dto/create-sujeto.dto';

describe('SujetosService', () => {
  let service: SujetosService;
  let repository: Repository<Sujeto>;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const mockSujeto = {
    spoId: 1,
    spoCuit: '20123456789',
    spoDenominacion: 'Test Sujeto',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateSujetoDto: CreateSujetoDto = {
    spoCuit: '30703088534',
    spoDenominacion: 'Test Sujeto',
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

    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SujetosService,
        {
          provide: getRepositoryToken(Sujeto),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<SujetosService>(SujetosService);
    repository = module.get<Repository<Sujeto>>(getRepositoryToken(Sujeto));
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = mockQueryRunner as unknown as QueryRunner;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new sujeto successfully', async () => {
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockSujeto as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockSujeto as any);

      const result = await service.create(mockCreateSujetoDto);

      expect(result).toEqual(mockSujeto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { spoCuit: mockCreateSujetoDto.spoCuit } });
      expect(repository.create).toHaveBeenCalledWith({
        spoCuit: mockCreateSujetoDto.spoCuit,
        spoDenominacion: mockCreateSujetoDto.spoDenominacion,
      });
      expect(repository.save).toHaveBeenCalledWith(mockSujeto);
    });

    it('should throw UnprocessableEntityException for invalid CUIT', async () => {
      const invalidDto = { ...mockCreateSujetoDto, spoCuit: '123' };

      await expect(service.create(invalidDto)).rejects.toThrow(UnprocessableEntityException);
      await expect(service.create(invalidDto)).rejects.toThrow('El CUIT es invalido.');
    });

  });

  describe('findOne', () => {
    it('should return a sujeto when found', async () => {
      const cuit = '20123456789';
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSujeto as any);

      const result = await service.findOne(cuit);

      expect(result).toEqual(mockSujeto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { spoCuit: cuit } });
    });




});
});
