/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CategoryDocument = mongoose.HydratedDocument<Category>;

@Schema({ versionKey: false })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  superID: Category;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
