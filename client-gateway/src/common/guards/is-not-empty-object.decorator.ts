import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotEmptyObject(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'string') {
            try {
              value = JSON.parse(value);
            } catch (e) {
              return false;
            }
          }
          return value && typeof value === 'object' && Object.keys(value).length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return 'El campo $property no debe ser un objeto vacío.';
        }
      }
    });
  };
}