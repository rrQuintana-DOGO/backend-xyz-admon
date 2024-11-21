import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from '@clients/dto/create-clients.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsUUID(null, { message: 'El id_client debe ser un UUID' })
  public id_client: string;
}