import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
export declare class CategoryService {
    private transactionModel;
    constructor(transactionModel: Model<CategoryDocument>);
    getExpenseCategories(): Promise<Category[]>;
    getIncomeCategories(): Promise<Category[]>;
}
