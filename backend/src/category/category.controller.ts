/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('expense')
    async getExpenseCategories() {
        return this.categoryService.getExpenseCategories();
    }

    @Get('income')
    async getIncomeCategories() {
        return this.categoryService.getIncomeCategories();
    }
}
