import authenticateMiddleware from 'middleware/authenticateMiddleware';
import express from 'express';
import roleMiddleware from 'middleware/roleMiddleware';
import { idParamMiddleware } from 'middleware/celebrate/commonCelebrate';
import { RoleEnum } from '@prisma/client';
import { userAuthMiddleware, userCreateMiddleware } from 'middleware/celebrate/userCelebrate';
import { UserController } from 'controller/UserController';

const userRoute = express.Router();

const controller = new UserController();

userRoute.route('/').post(userCreateMiddleware(), controller.create);

userRoute.route('/me').get(authenticateMiddleware, controller.getMe);

userRoute.route('/:id').get(idParamMiddleware(), authenticateMiddleware, controller.get);

userRoute.route('/').get(authenticateMiddleware, controller.getAll);

userRoute
  .route('/:id')
  .delete(authenticateMiddleware, roleMiddleware([RoleEnum.admin]), controller.delete);

userRoute.route('/auth').post(userAuthMiddleware(), controller.auth);

export default userRoute;
