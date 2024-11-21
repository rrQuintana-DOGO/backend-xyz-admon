import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleDto } from '@clients/modules/dto/create-module.dto';
import { IsUUID } from 'class-validator';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsUUID(null, { message: 'El id_module debe ser un UUID válido' })
  public id_module: string;
}