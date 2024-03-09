import { IGetCharacter } from './ICharacter';
import { UserCharacter } from '@prisma/client';

export interface IUserCharacter extends UserCharacter {
  character: IGetCharacter;
}

export interface IGetUserCharacter {
  id: number;
  level: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  experience: number;
  experienceMax: number;
  attributePoint: number;
  attributePointUsed: number;
  pointsAvailable: number;
  slot: number | null;
  createdAt: Date;
  character: IGetCharacter;
}
