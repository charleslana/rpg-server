import { Module } from '@nestjs/common';
import { UserAttributeController } from './user-attribute.controller';
import { UserAttributeService } from './user-attribute.service';

@Module({
  providers: [UserAttributeService],
  controllers: [UserAttributeController],
})
export class UserAttributeModule {}
