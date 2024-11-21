import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStripeCustomerDto {
  @IsNotEmpty({ message: "El id de stripe del cliente es requerido" })
  @IsString({ message: "El id de stripe del cliente es una cadena de texto" })
  public name: string;

  @IsNotEmpty({ message: "El correo del cliente es requerido" })
  @IsEmail({}, { message: "El correo del cliente es inválido" })
  public email: string;
}