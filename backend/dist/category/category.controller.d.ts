import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    getExpenseCategories(): Promise<import("../schemas/category.schema").Category[]>;
    getIncomeCategories(): Promise<import("../schemas/category.schema").Category[]>;
}
