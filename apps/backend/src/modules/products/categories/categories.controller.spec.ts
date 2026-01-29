jest.mock(
  'src/db/db.provider',
  () => ({
    InjectDb: () => jest.fn(),
    DB: jest.fn(),
  }),
  { virtual: true },
);

jest.mock(
  'src/db/schema',
  () => ({
    categoriesTable: {},
  }),
  { virtual: true },
);

jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
  like: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Categories, CategoryRequest, ClassRequestParams } from '@repo/types';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory: Categories = {
    id: 1,
    name: 'TESTING',
    order: 1,
    is_active: true,
    icon: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockCategoryRequest: CategoryRequest = {
    name: 'TESTING',
    order: 1,
    is_active: true,
    icon: '',
  };

  const mockCategoriesService = {
    Create: jest.fn(),
    FindAll: jest.fn(),
    FindOne: jest.fn(),
    Update: jest.fn(),
    Delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Create', () => {
    it('should create a category successfully', async () => {
      mockCategoriesService.Create.mockResolvedValue(mockCategory);

      const result = await controller.Create(mockCategoryRequest);

      expect(result).toEqual(mockCategory);
      expect(service.Create).toHaveBeenCalledWith(mockCategoryRequest);
      expect(service.Create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when body is null', async () => {
      await expect(controller.Create(null as any)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.Create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when name is missing', async () => {
      const invalidRequest = { ...mockCategoryRequest, name: '' };

      await expect(controller.Create(invalidRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.Create).not.toHaveBeenCalled();
    });
  });

  describe('FindAll', () => {
    it('should return an array of categories', async () => {
      const mockCategories = [mockCategory];
      mockCategoriesService.FindAll.mockResolvedValue(mockCategories);

      const query: ClassRequestParams = {
        offset: 0,
        limit: 10,
        search: 'TES',
      };
      const result = await controller.FindAll({
        limit: query.limit,
        offset: query.offset,
        search: query.search as string,
      });

      expect(result).toEqual(mockCategories);
      expect(service.FindAll).toHaveBeenCalledWith(query);
      expect(service.FindAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no categories exist', async () => {
      mockCategoriesService.FindAll.mockResolvedValue([]);

      const result = await controller.FindAll({
        limit: 10,
        offset: 0,
        search: '',
      });

      expect(result).toEqual([]);
      expect(service.FindAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update', () => {
    it('should update a category successfully', async () => {
      const updatedCategory = { ...mockCategory, name: 'UPDATED' };
      mockCategoriesService.Update.mockResolvedValue(updatedCategory);

      const updateRequest = { ...mockCategoryRequest, name: 'UPDATED' };
      const result = await controller.Update(1, updateRequest);

      expect(result).toEqual(updatedCategory);
      expect(service.Update).toHaveBeenCalledWith(updateRequest, 1);
      expect(service.Update).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when body is null', async () => {
      await expect(controller.Update(1, null as any)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.Update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when name is missing', async () => {
      const invalidRequest = { ...mockCategoryRequest, name: '' };

      await expect(controller.Update(1, invalidRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.Update).not.toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    it('should delete a category successfully', async () => {
      mockCategoriesService.Delete.mockResolvedValue({ deleted: true });

      const result = await controller.Delete(1);

      expect(result).toEqual('SuccessfullY Deleted Category');
      expect(service.Delete).toHaveBeenCalledWith(1);
      expect(service.Delete).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors when deleting', async () => {
      mockCategoriesService.Delete.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(controller.Delete(999)).rejects.toThrow(
        'Category not found',
      );
    });
  });
});
