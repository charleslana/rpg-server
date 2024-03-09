import logger from 'utils/logger';
import { ICreateUser, IUserAuth } from 'interface/IUser';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'service/UserService';

const service = new UserService();

export class UserController {
  public async create(
    request: Request<Record<string, unknown>, unknown, ICreateUser>,
    response: Response,
    next: NextFunction
  ) {
    logger.info(`Create user ${request.body.email}`);
    try {
      const handler = await service.create(request.body);
      return handler.toJSON(response);
    } catch (error) {
      next(error);
    }
  }

  public async getMe(request: Request, response: Response, next: NextFunction) {
    logger.info(`Get user me ${request.user.id}`);
    try {
      return response.status(200).json(await service.getById(request.user.id));
    } catch (error) {
      next(error);
    }
  }

  public async get(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    logger.info(`Get user id ${request.params.id}`);
    try {
      return response.status(200).json(await service.getById(+request.params.id));
    } catch (error) {
      next(error);
    }
  }

  public async getAll(_request: Request, response: Response, next: NextFunction) {
    logger.info('Get all user');
    try {
      return response.status(200).json(await service.getAll());
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    logger.info(`Delete user id ${request.params.id}`);
    try {
      const handler = await service.delete(+request.params.id);
      return handler.toJSON(response);
    } catch (error) {
      next(error);
    }
  }

  public async auth(
    request: Request<Record<string, unknown>, unknown, IUserAuth>,
    response: Response,
    next: NextFunction
  ) {
    logger.info(`Authenticate user ${request.body.email}`);
    try {
      return response
        .status(200)
        .json(await service.authenticate(request.body.email, request.body.password));
    } catch (error) {
      next(error);
    }
  }

  public async refreshAccessToken(request: Request, response: Response, next: NextFunction) {
    logger.info('Authenticate user with refresh token');
    try {
      const refreshToken = request.body.refreshToken;
      if (!refreshToken) {
        return response.status(401).json({ error: true, message: 'Token de atualização ausente' });
      }
      const accessToken = await service.refreshAccessToken(refreshToken);
      return response.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}
