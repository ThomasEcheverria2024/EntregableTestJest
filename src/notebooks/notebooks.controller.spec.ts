import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { Notebook } from './entities/notebook.entity';
import { HttpException } from '@nestjs/common';

describe('NotebooksController', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

  // Mock del servicio
  const mockNotebooksService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        {
          provide: NotebooksService,
          useValue: mockNotebooksService,
        },
      ],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of notebooks', async () => {
      const result: Notebook[] = [
        { id: 1, title: 'Notebook 1', content: 'Content 1' } as Notebook,
      ];
      mockNotebooksService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockNotebooksService.findAll).toHaveBeenCalled();
    });

    it('should throw HttpException on error', async () => {
      mockNotebooksService.findAll.mockRejectedValue(new Error('fail'));

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create and return a notebook', async () => {
      const dto: CreateNotebookDto = { title: 'New', content: 'Content' };
      const created: Notebook = { id: 1, ...dto } as Notebook;
      mockNotebooksService.create.mockResolvedValue(created);

      expect(await controller.create(dto)).toEqual(created);
      expect(mockNotebooksService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw HttpException on error', async () => {
      const dto: CreateNotebookDto = { title: 'New', content: 'Content' };
      mockNotebooksService.create.mockRejectedValue(new Error('fail'));

      await expect(controller.create(dto)).rejects.toThrow(HttpException);
    });
  });
});