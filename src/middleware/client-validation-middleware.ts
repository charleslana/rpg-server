import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientValidationMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const clientId = req.header('client_id');
    const clientSecret = req.header('client_secret');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const validClientId = this.configService.get<string>('CLIENT_ID');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const validClientSecret = this.configService.get<string>('CLIENT_SECRET');

    if (clientId !== validClientId || clientSecret !== validClientSecret) {
      throw new ForbiddenException('Invalid client credentials');
    }

    next();
  }
}
