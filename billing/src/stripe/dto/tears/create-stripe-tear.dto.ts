import { IsNumber, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'number-or-inf', async: false })
export class IsNumberOrInf implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === 'number' || value === 'inf';
  }

  defaultMessage(args: ValidationArguments) {
    return '($value) no es un número o "inf"';
  }
}

export class CreateStripeTearDto {
  @Validate(IsNumberOrInf, { message: 'El valor de up_to debe ser un número o "inf"' })
  public up_to: number | 'inf';

  @IsNumber({}, { message: 'El precio por unidad es un número' })
  public unit_amount: number;
}