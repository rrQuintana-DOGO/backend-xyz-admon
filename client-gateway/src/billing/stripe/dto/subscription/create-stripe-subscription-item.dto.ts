import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStripeSubscriptionItemDto {

  @IsNotEmpty({ message: "El id de stripe del precio es requerido" })
  @IsString({ message: "El id de stripe del precio es una cadena de texto" })
  public price: string;

  @IsNumber({}, { message: "Los días del periodo de prueba son un número" })
  public quantity?: number;
}