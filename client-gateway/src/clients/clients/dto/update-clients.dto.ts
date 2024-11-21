import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from '@clients/clients/dto/create-clients.dto';
import { IsUUID } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsUUID(null, { message: 'El id_client debe ser un UUID' })
  public id_client: string;
}