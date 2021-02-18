import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const saltOrRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    data['password'] = hashedPassword;
    const newUser = await this.prisma.user.create({
      data,
    });
    const { password, ...result } = newUser;
    return result;
  }
}
