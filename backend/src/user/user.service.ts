/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(username: string, email: string, password: string): Promise<User> {
    const newUser = new this.userModel({ username, email, password});
    return newUser.save();
  }

  async loginUser(email: string, password: string): Promise<User[]> {
    return this.userModel.find({ email, password }).exec();
  }

  async getUsers( userID: string ): Promise<User[]> {
    return this.userModel.find({ _id: userID }).exec();
  }
}