import HandlerError from 'handler/HandlerError';
import { NextFunction, Request, Response } from 'express';

const roleMiddleware = (roles: string[] = []) => {
  return [
    (request: Request, _response: Response, next: NextFunction) => {
      const userRoles = request.user.roles.filter(role => {
        return roles.includes(role.name);
      });
      if (roles.length > 0 && userRoles.length === 0) {
        return next(new HandlerError('Não autorizado.', 401));
      }
      return next();
    },
  ];
};

export default roleMiddleware;
