import * as mongoose from 'mongoose';
export type CategoryDocument = mongoose.HydratedDocument<Category>;
export declare class Category {
    name: string;
    superID: Category;
}
export declare const CategorySchema: mongoose.Schema<Category, mongoose.Model<Category, any, any, any, mongoose.Document<unknown, any, Category> & Category & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Category, mongoose.Document<unknown, {}, mongoose.FlatRecord<Category>> & mongoose.FlatRecord<Category> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
