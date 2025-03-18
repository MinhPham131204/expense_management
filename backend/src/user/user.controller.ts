/* eslint-disable prettier/prettier */ 
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(
    @Res({ passthrough: true }) response: Response,
    @Body('username') username: string,
    @Body('accountname') accountname: string,
    @Body('password') password: string,
    @Body('phone') phone: string,
  ) {
    const acc = await this.userService.createUser(username, accountname, password, phone);
    response.cookie('token', acc[0]['_id'], { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
    return { message: 'Signup successful' };
  }

  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body('accountname') accountname: string,
    @Body('password') password: string,
  ) {
    const acc = await this.userService.loginUser(accountname, password);
    if (acc.length) {
      response.cookie('token', acc[0]['_id'], { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
      return { message: 'Login successful' };
    } else {
      return { message: 'Login failed' };
    }
  }
}