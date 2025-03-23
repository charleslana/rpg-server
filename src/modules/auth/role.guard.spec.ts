import { RoleGuard } from './role.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from '@prisma/client';

describe('RoleGuard', () => {
  function createMockContext(userRoles: RoleEnum[]) {
    return {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            user: {
              roles: userRoles.map((role) => ({ name: role })),
            },
          }) as Request,
      }),
    } as ExecutionContext;
  }

  it('should allow request when user has the required role', () => {
    const guard = new RoleGuard([RoleEnum.admin]);
    const mockContext = createMockContext([RoleEnum.admin]);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw ForbiddenException when user does not have the required role', () => {
    const guard = new RoleGuard([RoleEnum.admin]);
    const mockContext = createMockContext([RoleEnum.user]);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should allow request when no role is required', () => {
    const guard = new RoleGuard([]);
    const mockContext = createMockContext([RoleEnum.user]);

    expect(guard.canActivate(mockContext)).toBe(true);
  });
});
