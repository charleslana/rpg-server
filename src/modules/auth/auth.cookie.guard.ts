import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthCookieGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      const logger = new Logger(AuthCookieGuard.name);
      logger.error('Unauthorized');
      throw new UnauthorizedException();
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_TOKEN,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if (request.cookies && request.cookies['access_token']) {
      return request.cookies['access_token'];
    }
    return undefined;
  }
}
