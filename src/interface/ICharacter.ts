import { CharacterClassEnum } from '@prisma/client';

export interface ICreateCharacter {
  name: string;
  description: string | null;
  characterClass: CharacterClassEnum;
}

export interface IUpdateCharacter {
  id: number;
  name: string;
  description: string | null;
  characterClass: CharacterClassEnum;
}

export interface IGetCharacter {
  id: number;
  name: string;
  description: string | null;
  characterClass: CharacterClassEnum;
}
