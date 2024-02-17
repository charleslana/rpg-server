import authenticateMiddleware from 'middleware/authenticateMiddleware';
import express from 'express';
import { idParamMiddleware } from 'middleware/celebrate/commonCelebrate';
import { UserCharacterController } from 'controller/UserCharacterController';

const userCharacterRoute = express.Router();

const controller = new UserCharacterController();

userCharacterRoute
  .route('/:id')
  .get(idParamMiddleware(), authenticateMiddleware, controller.getByIdAndUserId);

userCharacterRoute.route('/').get(authenticateMiddleware, controller.getAllByUserId);

userCharacterRoute.route('/:id').delete(authenticateMiddleware, controller.deleteByIdAndUserId);

export default userCharacterRoute;
