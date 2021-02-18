import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
