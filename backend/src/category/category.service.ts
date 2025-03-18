/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private transactionModel: Model<CategoryDocument>) {}

    async getCategories(): Promise<Category[]> {
        const rootCategories = await this.transactionModel.find({ superID: null }).select("name").exec();
        
        // Sử dụng Promise.all để thực hiện các truy vấn con song song, tối ưu hiệu năng
        const categoriesWithSubs = await Promise.all(
            rootCategories.map(async (rootCategory) => {
                // Tìm tất cả danh mục con của danh mục gốc này
                const subCategories = await this.transactionModel.find({ superID: rootCategory._id }).select("name").exec();
                
                // Tạo một bản sao của rootCategory để không thay đổi trực tiếp dữ liệu gốc
                const categoryWithSubs = rootCategory.toObject();
                // Thêm các danh mục con vào danh mục gốc
                categoryWithSubs['subCategory'] = subCategories;
                
                return categoryWithSubs;
            })
        );
        
        return categoriesWithSubs;
    }
}
