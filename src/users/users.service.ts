import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<User, 'password'>> {
    const saltOrRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    data['password'] = hashedPassword;
    try {
      const newUser = await this.prisma.user.create({
        data,
      });

      const { password, ...result } = newUser;

      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async findByUniqueArgs(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }
}
