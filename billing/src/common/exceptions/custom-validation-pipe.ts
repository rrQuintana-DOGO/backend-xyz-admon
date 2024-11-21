import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      const errors = this.flattenValidationErrors(validationErrors);
      Logger.error(errors);
      return new RpcException({
        status: 400,
        message: errors,
      });
    };
  }
}