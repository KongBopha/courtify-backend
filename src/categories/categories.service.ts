import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiResponse } from 'src/common/api-response';
import { CategoryDto } from 'src/venues/dto/venue-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,
  ){}
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  // findAll() {
  //   return `This action returns all categories`;
  // }
  async findAll(): Promise<ApiResponse<CategoryDto[]>>{

    const result = await this.CategoryRepository.find();
    return new ApiResponse("SUCCESS", "List category retrieve successfully.",result);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
