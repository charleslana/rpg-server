import sanitizeHtml from 'sanitize-html';
import { celebrate, Joi, Segments } from 'celebrate';

export const idParamMiddleware = () => {
  return celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.number().integer().min(1).required(),
      },
    },
    { abortEarly: false }
  );
};

export const escapeTagsHTML = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
