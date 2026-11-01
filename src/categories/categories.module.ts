import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Court } from 'src/courts/entities/court.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Category,Court])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports:[CategoriesService],
})
export class CategoriesModule {}
