import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(private prisma: PrismaService) {}

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return this.prisma.refreshToken.create({ data });
  }

  async deleteTokens(
    refreshTokenDeleteManyArgs: Prisma.RefreshTokenDeleteManyArgs,
  ) {
    // we should only ever have to delete one token but deleteMany is a fail safe
    return this.prisma.refreshToken.deleteMany(refreshTokenDeleteManyArgs);
  }

  async findRefreshTokenByToken(
    refreshTokenWhereInput: Prisma.RefreshTokenWhereInput,
  ) {
    return this.prisma.refreshToken.findFirst({
      where: refreshTokenWhereInput,
    });
  }
}
