import { CreateStripeSubscriptionDto } from '@stripe/dto/subscription/create-stripe-subscription.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsUUID, IsOptional, IsString, IsNotEmpty, IsBoolean, IsEmail, Matches, Length } from 'class-validator';

export class CreateClientDto extends PartialType(CreateStripeSubscriptionDto) {
  @IsOptional()
  @IsUUID(null, { message: 'El id_client debe ser un UUID' })
  public id_client?: string;

  @IsOptional()
  @IsString({ message: 'El id_ext debe ser un string' })
  @IsNotEmpty({ message: 'El id_ext no puede estar vacío' })
  public id_ext?: string;

  @IsOptional()
  @IsString({ message: 'El id_sap debe ser un string' })
  @IsNotEmpty({ message: 'El id_sap no puede estar vacío' })
  public id_sap?: string;

  @IsString({ message: 'El name debe ser un string' })
  @IsNotEmpty({ message: 'El name no puede estar vacío' })
  public name: string;

  @IsEmail({}, { message: 'El email debe ser un email válido' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  public email: string;

  @IsString({ message: 'El company_name debe ser un string' })
  @IsNotEmpty({ message: 'El company_name no puede estar vacío' })
  public company_name: string;

  @IsString({ message: 'El address debe ser un string' })
  @IsNotEmpty({ message: 'El address no puede estar vacío' })
  public address: string;

  @IsString({ message: 'El rfc debe ser un string' })
  @IsNotEmpty({ message: 'El rfc no puede estar vacío' })
  @Matches(/^[A-Z0-9]+$/, { message: 'El rfc debe ser alfanumérico y en mayúsculas' })
  @Length(12, 13, { message: 'El rfc debe tener una longitud de 12 o 13 caracteres' })
  public rfc: string;

  @IsOptional()
  @IsString({ message: 'El slug debe ser un string' })
  @IsNotEmpty({ message: 'El slug no puede estar vacío' })
  public slug: string;

  @IsOptional()
  @IsBoolean({ message: 'El status debe ser un valor booleano' })
  public status: boolean;

  constructor(partial?: Partial<CreateClientDto>) {
    super(partial);
    this.status = true;
  }
}