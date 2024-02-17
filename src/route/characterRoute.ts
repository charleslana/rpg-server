import authenticateMiddleware from 'middleware/authenticateMiddleware';
import express from 'express';
import roleMiddleware from 'middleware/roleMiddleware';
import { CharacterController } from 'controller/CharacterController';
import { idParamMiddleware } from 'middleware/celebrate/commonCelebrate';
import { RoleEnum } from '@prisma/client';
import {
  characterCreateMiddleware,
  characterUpdateMiddleware,
  escapeCharacterHTMLMiddleware,
} from 'middleware/celebrate/characterCelebrate';

const characterRoute = express.Router();

const controller = new CharacterController();

characterRoute
  .route('/')
  .post(
    characterCreateMiddleware(),
    escapeCharacterHTMLMiddleware,
    authenticateMiddleware,
    roleMiddleware([RoleEnum.admin]),
    controller.create
  );

characterRoute
  .route('/')
  .put(
    characterUpdateMiddleware(),
    escapeCharacterHTMLMiddleware,
    authenticateMiddleware,
    roleMiddleware([RoleEnum.admin]),
    controller.update
  );

characterRoute.route('/:id').get(idParamMiddleware(), authenticateMiddleware, controller.get);

characterRoute.route('/').get(authenticateMiddleware, controller.getAll);

characterRoute
  .route('/:id')
  .delete(authenticateMiddleware, roleMiddleware([RoleEnum.admin]), controller.delete);

export default characterRoute;
