import { applyDecorators, UseGuards } from '@nestjs/common';
import { createUUIDValidationGuard } from '@common/guards/uuid-validation.guard';

export function UUIDGuard(idField: string[] | string) {
  return applyDecorators(UseGuards(createUUIDValidationGuard(idField)));
}
