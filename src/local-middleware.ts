import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LocalMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const ip = req.ip;
    if (ip === '::1' || ip === '127.0.0.1' || req.hostname === 'localhost') {
      next();
    } else {
      throw new ForbiddenException(
        'Access to /api-docs is restricted to localhost only',
      );
    }
  }
}
