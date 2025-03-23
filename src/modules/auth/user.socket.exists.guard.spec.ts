import { UserSocketExistsGuard } from './user.socket.exists.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SocketUserService } from '../socket/socket.user.service';
import { SocketRoomService } from '../socket/socket.room.service';
import { Request } from 'express';

describe('UserSocketExistsGuard', () => {
  let guard: UserSocketExistsGuard;
  let socketUserService: jest.Mocked<SocketUserService>;
  let socketRoomService: jest.Mocked<SocketRoomService>;

  beforeEach(() => {
    socketUserService = {
      userOriginalIdExists: jest.fn(),
    } as unknown as jest.Mocked<SocketUserService>;

    socketRoomService = {
      hasUserOriginalIdInAnyRoom: jest.fn(),
    } as unknown as jest.Mocked<SocketRoomService>;

    guard = new UserSocketExistsGuard(socketUserService, socketRoomService);
  });

  function createMockContext(userId: string) {
    return {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            user: { sub: userId },
          }) as unknown as Request,
      }),
    } as ExecutionContext;
  }

  it('should allow request when user is not logged in socket', () => {
    socketUserService.userOriginalIdExists.mockReturnValue(false);
    socketRoomService.hasUserOriginalIdInAnyRoom.mockReturnValue(false);

    const mockContext = createMockContext('user123');

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw ForbiddenException when user is already logged in socket', () => {
    socketUserService.userOriginalIdExists.mockReturnValue(true);
    socketRoomService.hasUserOriginalIdInAnyRoom.mockReturnValue(false);

    const mockContext = createMockContext('user123');

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user is in a socket room', () => {
    socketUserService.userOriginalIdExists.mockReturnValue(false);
    socketRoomService.hasUserOriginalIdInAnyRoom.mockReturnValue(true);

    const mockContext = createMockContext('user123');

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });
});
