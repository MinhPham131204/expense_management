import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(username: string, email: string, password: string, phone: string): Promise<User>;
    loginUser(accountname: string, password: string): Promise<User[]>;
}
