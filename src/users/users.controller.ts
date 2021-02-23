import { Controller, Get, Post, Request } from '@nestjs/common';
import { Public } from 'src/auth/publicRoute';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post()
  async createUser(@Request() req) {
    return this.usersService.createUser(req.body);
  }
}
