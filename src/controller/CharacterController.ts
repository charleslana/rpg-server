import logger from 'utils/logger';
import { CharacterService } from 'service/CharacterService';
import { ICreateCharacter, IUpdateCharacter } from 'interface/ICharacter';
import { NextFunction, Request, Response } from 'express';

const service = new CharacterService();

export class CharacterController {
  public async create(
    request: Request<Record<string, unknown>, unknown, ICreateCharacter>,
    response: Response,
    next: NextFunction
  ) {
    logger.info(`Create character ${request.body.name}`);
    try {
      const handler = await service.create(request.body);
      return handler.toJSON(response);
    } catch (error) {
      next(error);
    }
  }

  public async update(
    request: Request<Record<string, unknown>, unknown, IUpdateCharacter>,
    response: Response,
    next: NextFunction
  ) {
    logger.info(`Update character ${request.body.id}`);
    try {
      const handler = await service.update(request.body);
      return handler.toJSON(response);
    } catch (error) {
      next(error);
    }
  }

  public async get(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    logger.info(`Get character id ${request.params.id}`);
    try {
      return response.status(200).json(await service.getById(+request.params.id));
    } catch (error) {
      next(error);
    }
  }

  public async getAll(_request: Request, response: Response, next: NextFunction) {
    logger.info('Get all character');
    try {
      return response.status(200).json(await service.getAll());
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request<{ id: string }>, response: Response, next: NextFunction) {
    logger.info(`Delete character id ${request.params.id}`);
    try {
      const handler = await service.delete(+request.params.id);
      return handler.toJSON(response);
    } catch (error) {
      next(error);
    }
  }
}
