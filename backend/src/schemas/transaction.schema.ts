/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';

export type TransactionDocument = mongoose.HydratedDocument<Transaction>;

@Schema({ versionKey: false })
export class Transaction {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: User;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryID: Category;

  @Prop({ required: true })
  money: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  datetime: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);