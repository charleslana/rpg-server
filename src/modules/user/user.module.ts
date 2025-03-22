import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@/modules/user/user.repository';
import { PrismaModule } from '@/database/prisma.module';
import { SocketModule } from '@/modules/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
