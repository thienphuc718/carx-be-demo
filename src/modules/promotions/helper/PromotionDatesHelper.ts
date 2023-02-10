import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isMatch } from 'date-fns';

@ValidatorConstraint()
export class IsValidPromotionDateConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any) {
    if (typeof value === 'string') {
      return (
        /^[1-9]\d*-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value) &&
        isMatch(value, 'yyyy-MM-dd')
      );
    }
    return false;
  }
  defaultMessage({ property }) {
    return `${property} must be a valid date (Required format: yyyy-MM-dd)`;
  }
}

export function IsValidPromotionDate(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPromotionDateConstraint,
    });
  };
}
