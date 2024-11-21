import {  IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CollectionScheme, PaymentMethodScheme } from '@billing/stripe/entities/stripe-price.entity';
import { CreateStripeSubscriptionItemDto } from './create-stripe-subscription-item.dto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateStripeSubscriptionDto extends PartialType(CreateStripeSubscriptionItemDto) {
  @IsOptional()
  @IsString({ message: "El id de stripe del cliente es una cadena de texto" })
  public customer: string;

  @IsNumber({}, { message: "Los días del periodo de prueba son un número" })
  public trial_period_days: number;

  @IsNotEmpty({ message: "El tipo de esquema de facturación es requerido" })
  @IsEnum(CollectionScheme, { message: "El tipo de esquema de facturación es inválido" })
  public collection_method: CollectionScheme;

  @IsNotEmpty({ message: "Los métodos de pago son requeridos" })
  @IsEnum(PaymentMethodScheme, { message: "Los métodos de pago son inválidos" })
  public payment_method_type: PaymentMethodScheme;

  @IsOptional()
  @IsNumber({}, { message: "Los días hasta el vencimiento son un número" })
  public days_until_due?: number;

  @IsNumber({}, { message: "Las unidades son un número" })
  public units: number;

  @IsBoolean({ message: "El módulo de temperatura es un booleano" })
  public temperature_module: boolean;

  @IsBoolean({ message: "El módulo de combustible es un booleano" })
  public fuel_module: boolean;

  @IsBoolean({ message: "El módulo de mantenimiento es un booleano" })
  public maintenance_module: boolean;
}