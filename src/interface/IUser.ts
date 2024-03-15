import { Role, User } from '@prisma/client';

export interface IUser extends User {
  roles: Role[];
}

export interface ICreateUser {
  email: string;
  password: string;
  name: string;
}

export interface IGetUser {
  id: number;
  name: string;
  updatedAt: Date;
}

export interface IUserAuth {
  email: string;
  password: string;
}

export interface UserMe {
  id: number;
  name: string;
  level: number;
  gold: number;
  ruby: number;
  experience: number;
  maxExperience: number;
}
