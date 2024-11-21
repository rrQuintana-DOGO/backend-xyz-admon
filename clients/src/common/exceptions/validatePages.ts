import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function validatePageAndLimit(page: number, totalPages: number) {
  if (totalPages === 0) {
    throw new RpcException({
      message: 'No hay registros para mostrar',
      status: HttpStatus.BAD_REQUEST,
    })
  } else if (page > totalPages) {
    throw new RpcException({
      message: 'La página solicitada no existe',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}