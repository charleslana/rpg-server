declare namespace Express {
  import { Role } from '@prisma/client';

  export interface Request {
    user: {
      id: number;
      roles: Role[];
    };
  }
}
