import { UserService } from './user.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(response: Response, username: string, accountname: string, password: string, phone: string): Promise<{
        message: string;
    }>;
    loginUser(response: Response, accountname: string, password: string): Promise<{
        message: string;
    }>;
}
