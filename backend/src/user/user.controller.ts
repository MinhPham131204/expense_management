/* eslint-disable prettier/prettier */ 
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, Res, Req, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async createUser(
    @Res({ passthrough: true }) response: Response,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const acc = await this.userService.createUser(username, email, password);
    response.cookie('token', acc['_id'].toString(), { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
    return { message: 'Signup successful' };
  }

  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const acc = await this.userService.loginUser(email, password);
    console.log('acc: ', acc);
    
    if (acc.length !== 0) {
      response.cookie('token', acc[0]['_id'].toString(), { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
      return response.status(200).json({ message: 'Login successful' });
    } else {
      console.log('failed');
      return response.status(401).json({ message: 'Login failed' });
    }
  }

  @Get()
  async getUsers(
    @Req() req: Request,
  ) {
    return this.userService.getUsers(req.cookies['token']);
  }
}