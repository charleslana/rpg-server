import { celebrate, Joi, Segments } from 'celebrate';
import { CharacterClassEnum } from '@prisma/client';
import { escapeTagsHTML } from './commonCelebrate';
import { ICreateCharacter } from 'interface/ICharacter';
import { NextFunction, Request, Response } from 'express';

export const characterCreateMiddleware = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        name: Joi.string().trim().min(1).max(255).required().messages({
          'string.min':
            'O tamanho do texto de {{#label}} deve ter pelo menos {{#limit}} caracteres',
          'string.max':
            '{{#label}} tamanho do texto deve ser menor ou igual a {{#limit}} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
        description: Joi.string().trim().min(1).max(5000).allow('').allow(null).messages({
          'string.min':
            'O tamanho do texto de {{#label}} deve ter pelo menos {{#limit}} caracteres',
          'string.max':
            '{{#label}} tamanho do texto deve ser menor ou igual a {{#limit}} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
        characterClass: Joi.string()
          .valid(...Object.values(CharacterClassEnum))
          .required()
          .messages({
            'string.base': 'O campo {{#label}} deve ser uma string válida',
            'any.only': 'O valor do campo {{#label}} deve ser um dos valores válidos: {{#valids}}',
            'any.required': 'O campo {{#label}} é obrigatório',
          }),
      },
    },
    { abortEarly: false }
  );
};

export const characterUpdateMiddleware = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        id: Joi.number().integer().min(1).required().messages({
          'number.base': 'O campo {{#label}} deve ser um número',
          'number.integer': 'O campo {{#label}} deve ser um número inteiro',
          'number.min': 'O campo {{#label}} deve ser maior ou igual a {{#limit}}',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
        name: Joi.string().trim().min(1).max(255).required().messages({
          'string.min':
            'O tamanho do texto de {{#label}} deve ter pelo menos {{#limit}} caracteres',
          'string.max':
            '{{#label}} tamanho do texto deve ser menor ou igual a {{#limit}} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
        description: Joi.string().trim().min(1).max(5000).allow('').allow(null).messages({
          'string.min':
            'O tamanho do texto de {{#label}} deve ter pelo menos {{#limit}} caracteres',
          'string.max':
            '{{#label}} tamanho do texto deve ser menor ou igual a {{#limit}} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
        characterClass: Joi.string()
          .valid(...Object.values(CharacterClassEnum))
          .required()
          .messages({
            'string.base': 'O campo {{#label}} deve ser uma string válida',
            'any.only': 'O valor do campo {{#label}} deve ser um dos valores válidos: {{#valids}}',
            'any.required': 'O campo {{#label}} é obrigatório',
          }),
      },
    },
    { abortEarly: false }
  );
};

export function escapeCharacterHTMLMiddleware(
  request: Request<Record<string, unknown>, unknown, ICreateCharacter>,
  _response: Response,
  next: NextFunction
) {
  if (request.body.name) {
    request.body.name = escapeTagsHTML(request.body.name);
  }
  if (request.body.description) {
    request.body.description = escapeTagsHTML(request.body.description);
  }
  next();
}
