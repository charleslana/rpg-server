import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({});
    guard = new AuthGuard(jwtService);
  });

  function createMockContext(authHeader?: string) {
    return {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            headers: authHeader ? { authorization: authHeader } : {},
          }) as Request,
      }),
    } as ExecutionContext;
  }

  it('should allow request when token is valid', async () => {
    const mockContext = createMockContext('Bearer valid_token');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({ userId: 1 });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException when no token is provided', async () => {
    const mockContext = createMockContext();
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    const mockContext = createMockContext('Bearer invalid_token');
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when authorization header is not Bearer', async () => {
    const mockContext = createMockContext('Basic invalid_token');
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
