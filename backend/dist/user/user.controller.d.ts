import { UserService } from './user.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(username: string, accountname: string, password: string, phone: string): Promise<import("../schemas/user.schema").User>;
    loginUser(response: Response, accountname: string, password: string): Promise<{
        message: string;
    }>;
}
