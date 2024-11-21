import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UUIDValidationGuard implements CanActivate {
  private readonly idFields: string[];
  private readonly logger = new Logger('UUIDValidationGuard');

  constructor(idFields: string[] | string) {
    this.idFields = Array.isArray(idFields) ? idFields : [idFields];
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToRpc().getData();

    if (Array.isArray(data)) {
      for (const item of data) {
        this.validateUUIDs(item);
      }
    } else {
      this.validateUUIDs(data);
    }

    return true;
  }

  private validateUUIDs(data: any) {
    for (const idField of this.idFields) {
      const idValue = data[idField];
      if (Array.isArray(idValue)) {
        for (const id of idValue) {
          this.validateUUID(id);
        }
      } else {
        this.validateUUID(idValue);
      }
    }
  }

  private validateUUID(id: string) {
    if (id && !isUUID(id)) {
      this.logger.error(`El id ${id} no es un UUID válido}`);
      throw new RpcException({
        message: `El id ${id} no es un UUID válido`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}

export function createUUIDValidationGuard(idFields: string[] | string) {
  return new UUIDValidationGuard(idFields);
}
