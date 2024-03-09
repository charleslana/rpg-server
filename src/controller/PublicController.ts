import logger from 'utils/logger';
import { NextFunction, Request, Response } from 'express';
import { PublicService } from 'service/PublicService';

const service = new PublicService();

export class PublicController {
  public getVersion(_request: Request, response: Response, next: NextFunction) {
    logger.info('Get server version');
    try {
      return response.status(200).json(service.getVersion());
    } catch (error) {
      next(error);
    }
  }
}
