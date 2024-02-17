import logger from 'utils/logger';
import { NextFunction, Request, Response } from 'express';
import { UserCharacterService } from 'service/UserCharacterService';

const service = new UserCharacterService();

export class UserCharacterController {
  public async getByIdAndUserId(
    request: Request<{ id: string }>,
    response: Response,
    next: NextFunction
  ) {
    logger.info(`Get user character id ${request.params.id}`);
    try {
      return response
        .status(200)
        .json(await service.getByIdAndUserId(+request.params.id, request.user.id));
    } catch (error) {
      next(error);
    }
  }

  public async getAllByUserId(request: Request, response: Response, next: NextFunction) {
    logger.info(`Get all user character ${request.user.id}`);
    try {
      return response.status(200).json(await service.getAllByUserId(request.user.id));
    } catch (error) {
      next(error);
    }
  }

  public async deleteByIdAndUserId(
    request: Request<{ id: string }>,
    response: Response,
    next: NextFunction
  ) {
    logger.info(`Delete user character id ${request.params.id}`);
    try {
      const handler = await service.deleteByIdAndUserId(+request.params.id, request.user.id);
      return handler.toJSON(response);
    } catch (error) {
      next(error);
    }
  }
}
