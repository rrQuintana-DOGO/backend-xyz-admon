import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStripeProductDto {
  @IsString({ message: "El id del producto es requerido" })
  @IsOptional()
  public id?: string;

  @IsString({ message: "El nombre del producto es requerido" })
  @IsNotEmpty({ message: "El nombre del producto no puede estar vacío" })
  public name: string;

  @IsString({ message: "La descripción del producto es requerida" })
  @IsNotEmpty({ message: "La descripción del producto no puede estar vacía" })
  public description: string;

  @IsBoolean({ message: "El campo activo debe ser un booleano" })
  public active: boolean;

  @IsOptional()
  @IsArray({ message: "Las imágenes deben ser un arreglo de cadenas de texto" })
  @IsString({ each: true , message: "Cada imagen debe ser una cadena de texto" })
  public images?: string[];
}