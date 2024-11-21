import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { 
  CreateStripeRecurringDto,
  CreateStripeTearDto
} from '@billing/stripe/dto/index';
import { Type } from 'class-transformer';
import { BillingScheme, TierMode } from '@billing/stripe/entities/stripe-price.entity';

export class CreateStripePriceDto {
  @IsString({ message: "El id del precio es requerido" })
  @IsOptional()
  public id?: string;
  
  @IsOptional()
  @ValidateNested({ message: 'El tipo de cobro debe ser un objeto' })
  @Type(() => CreateStripeRecurringDto)
  public recurring: CreateStripeRecurringDto

  @IsString({ message: 'La moneda es una cadena de texto' })
  @IsNotEmpty({ message: 'La moneda no puede estar vacía' })
  public currency: string;

  @IsString({ message: 'El producto es una cadena de texto' })
  @IsNotEmpty({ message: 'El producto no puede estar vacío' })
  public product: string;

  @IsEnum(BillingScheme, { message: 'El esquema de facturación debe ser "per_unit" o "tiered"' })
  public billing_scheme: BillingScheme;

  @IsString({ message: 'El modo del tier es una cadena de texto' })
  @IsNotEmpty({ message: 'El modo del tier no puede estar vacío' })
  public tiers_mode: TierMode;

  @IsArray({ message: 'Los tiers deben ser un array' })
  @ArrayNotEmpty({ message: 'Los tiers no pueden estar vacíos' })
  @ValidateNested({ each: true, message: 'Los tiers deben de ser un objeto' })
  @Type(() => CreateStripeTearDto)
  public tiers?: [];
}