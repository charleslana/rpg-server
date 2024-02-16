import { celebrate, CelebrateError, Joi, Segments } from 'celebrate';

export const userCreateMiddleware = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        email: Joi.string()
          .email()
          .trim()
          .max(50)
          .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)
          .required()
          .messages({
            'string.email': 'O campo {{#label}} deve conter um e-mail válido',
            'any.custom': 'O campo {{#label}} deve conter apenas letras minúsculas',
            'string.max':
              '{{#label}} tamanho do texto deve ser menor ou igual a {{#limit}} caracteres',
            'string.pattern.base': 'O campo {{#label}} deve seguir o formato de e-mail esperado',
            'any.required': 'O campo {{#label}} é obrigatório',
          })
          .custom(value => {
            if (value !== value.toLowerCase()) {
              throw new CelebrateError('O campo email deve conter apenas letras minúsculas');
            }
            return value;
          }),
        password: Joi.string().required().min(6).max(50).messages({
          'string.base': 'O campo {{#label}} deve ser uma string válida',
          'string.min': 'O campo {{#label}} deve ter pelo menos {#limit} caracteres',
          'string.max': 'O campo {{#label}} não deve ter mais de {#limit} caracteres',
          'any.required': 'O campo {{#label}} é obrigatório',
        }),
        name: Joi.string()
          .pattern(/^[a-zA-Z0-9]*$/)
          .trim()
          .min(3)
          .max(15)
          .required()
          .messages({
            'string.pattern.base':
              'o campo {{#label}} com o valor {:[.]} deve conter apenas letras sem acentos e números',
            'string.min':
              'O tamanho do texto de {{#label}} deve ter pelo menos {{#limit}} caracteres',
            'string.max':
              '{{#label}} tamanho do texto deve ser menor ou igual a {{#limit}} caracteres',
            'any.required': 'O campo {{#label}} é obrigatório',
            'string.empty': 'O campo {{#label}} não pode estar vazio',
          }),
      },
    },
    { abortEarly: false }
  );
};

export const userAuthMiddleware = () => {
  return celebrate(
    {
      [Segments.BODY]: {
        email: Joi.string()
          .email()
          .trim()
          .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)
          .required()
          .messages({
            'string.email': 'O campo {{#label}} deve conter um e-mail válido',
            'any.custom': 'O campo {{#label}} deve conter apenas letras minúsculas',
            'string.pattern.base': 'O campo {{#label}} deve seguir o formato de e-mail esperado',
            'any.required': 'O campo {{#label}} é obrigatório',
            'string.empty': 'O campo {{#label}} não pode estar vazio',
          })
          .custom(value => {
            if (value !== value.toLowerCase()) {
              throw new CelebrateError('O campo email deve conter apenas letras minúsculas');
            }
            return value;
          }),
        password: Joi.string().required().messages({
          'any.required': 'O campo {{#label}} é obrigatório',
          'string.empty': 'O campo {{#label}} não pode estar vazio',
        }),
      },
    },
    { abortEarly: false }
  );
};
