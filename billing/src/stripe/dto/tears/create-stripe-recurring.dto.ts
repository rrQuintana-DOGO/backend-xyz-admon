import { IsString } from 'class-validator';
import { Interval } from '@stripe/entities/stripe-price.entity';

export class CreateStripeRecurringDto {
  @IsString({ message: 'El intervalo es una cadena de texto' })
  public interval: Interval;
}