import * as mongoose from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';
export type BudgetDocument = mongoose.HydratedDocument<Budget>;
export declare class Budget {
    userID: User;
    categoryID: Category;
    budget: string;
    createdTime: Date;
}
export declare const BudgetSchema: mongoose.Schema<Budget, mongoose.Model<Budget, any, any, any, mongoose.Document<unknown, any, Budget> & Budget & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Budget, mongoose.Document<unknown, {}, mongoose.FlatRecord<Budget>> & mongoose.FlatRecord<Budget> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
