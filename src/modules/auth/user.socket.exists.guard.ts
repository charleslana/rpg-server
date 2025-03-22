import { SocketRoomService } from '../socket/socket.room.service';
import { SocketUserService } from '../socket/socket.user.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserSocketExistsGuard implements CanActivate {
  constructor(
    private readonly socketUserService: SocketUserService,
    private readonly socketRoomService: SocketRoomService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const userId = request.user.sub;
    if (
      this.socketUserService.userOriginalIdExists(userId) ||
      this.socketRoomService.hasUserOriginalIdInAnyRoom(userId)
    ) {
      const logger = new Logger(UserSocketExistsGuard.name);
      logger.error('User already logged');
      throw new ForbiddenException('User already logged');
    }
    return true;
  }
}
