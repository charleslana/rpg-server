import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NoHtmlTags(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'noHtmlTags',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          const htmlTagRegex = /<\/?[a-z][\s\S]*>/i;
          return typeof value === 'string' && !htmlTagRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not contain HTML tags`;
        },
      },
    });
  };
}
