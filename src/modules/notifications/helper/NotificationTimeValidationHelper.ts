import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsValidNotificationTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (typeof value === 'string') {
      return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
    }
    return false;
  }
  defaultMessage({ property }) {
    return `${property} must be a valid time (Required format: hh:mm)`;
  }
}

export function IsValidNotificationTime(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidNotificationTimeConstraint,
    });
  };
}
