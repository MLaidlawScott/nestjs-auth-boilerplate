import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async createUser(data: Prisma.UserCreateInput) {
    const saltOrRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    data['password'] = hashedPassword;
    try {
      const newUser = await this.prisma.user.create({
        data,
      });
      const { password, ...result } = newUser;

      // const payload = { sub: newUser.id };

      return result;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
