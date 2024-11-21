import {  IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CollectionScheme, PaymentMethodScheme } from '@billing/stripe/entities/stripe-price.entity';
import { CreateStripeSubscriptionItemDto } from './create-stripe-subscription-item.dto';
import { Type } from 'class-transformer';

export class UpdateStripeSubscriptionDto {
  @IsNotEmpty({ message: "El id de stripe del cliente es requerido" })
  @IsString({ message: "El id de stripe del cliente es una cadena de texto" })
  public subscriptionId: string;

  @IsNotEmpty({ message: "El tipo de esquema de facturación es requerido" })
  @IsString({ message: "El tipo de esquema de facturación es una cadena de texto" })
  clientId: string;
  
  @IsNotEmpty({ message: "El tipo de esquema de facturación es requerido" })
  @IsEnum(CollectionScheme, { message: "El tipo de esquema de facturación es inválido" })
  public collection_method: CollectionScheme;

  @IsNotEmpty({ message: "Los métodos de pago son requeridos" })
  @IsEnum(PaymentMethodScheme, { message: "Los métodos de pago son inválidos" })
  public payment_method_type: PaymentMethodScheme;

  @IsBoolean({ message: "El módulo de temperatura es un booleano" })
  public temperature_module: boolean;

  @IsBoolean({ message: "El módulo de combustible es un booleano" })
  public fuel_module: boolean;

  @IsBoolean({ message: "El módulo de mantenimiento es un booleano" })
  public maintenance_module: boolean;

  @IsNumber({}, { message: "Las unidades son un número" })
  public units: number;
}