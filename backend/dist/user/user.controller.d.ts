import { UserService } from './user.service';
import { Response, Request } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(response: Response, username: string, email: string, password: string): Promise<{
        message: string;
    }>;
    loginUser(response: Response, email: string, password: string): Promise<Response<any, Record<string, any>>>;
    getUsers(req: Request): Promise<import("../schemas/user.schema").User[]>;
}
