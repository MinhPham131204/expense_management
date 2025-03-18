import * as mongoose from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';
export type TransactionDocument = mongoose.HydratedDocument<Transaction>;
export declare class Transaction {
    userID: User;
    type: string;
    categoryID: Category;
    money: string;
    description: string;
    datetime: Date;
}
export declare const TransactionSchema: mongoose.Schema<Transaction, mongoose.Model<Transaction, any, any, any, mongoose.Document<unknown, any, Transaction> & Transaction & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Transaction, mongoose.Document<unknown, {}, mongoose.FlatRecord<Transaction>> & mongoose.FlatRecord<Transaction> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
