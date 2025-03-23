import { AuthCookieGuard } from './auth.cookie.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthCookieGuard', () => {
  let guard: AuthCookieGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({});
    guard = new AuthCookieGuard(jwtService);
  });

  function createMockContext(cookie?: string) {
    return {
      switchToHttp: () => ({
        getRequest: () =>
          ({
            cookies: cookie ? { access_token: cookie } : {},
          }) as Request,
      }),
    } as ExecutionContext;
  }

  it('should allow request when token is valid', async () => {
    const mockContext = createMockContext('valid_token');
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
    const mockContext = createMockContext('invalid_token');
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
