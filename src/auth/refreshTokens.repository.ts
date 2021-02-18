import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(private prisma: PrismaService) {}

  async createRefreshToken(data: Prisma.RefreshTokenCreateInput) {
    return this.prisma.refreshToken.create({ data });
  }
}
