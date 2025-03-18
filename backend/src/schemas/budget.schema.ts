/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';

export type BudgetDocument = mongoose.HydratedDocument<Budget>;

@Schema({ versionKey: false })
export class Budget {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userID: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryID: Category;

  @Prop({ required: true })
  budget: string;

  @Prop({ required: true })
  createdTime: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
