import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from './entities/notebook.entity';
import { Repository } from 'typeorm';
import { CreateNotebookDto } from './dto/create-notebook.dto';

describe('NotebooksService', () => {
  let service: NotebooksService;
  let mockRepository: Partial<Record<keyof Repository<Notebook>, jest.Mock>>;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn().mockImplementation((dto: CreateNotebookDto) => dto),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of notebooks', async () => {
      const result = [{ title: 'Test', content: 'Content' }];
      (mockRepository.find as jest.Mock).mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a notebook', async () => {
      const dto: CreateNotebookDto = { title: 'Test', content: 'Content' };
      (mockRepository.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });
});