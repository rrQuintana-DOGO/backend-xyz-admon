import { IsOptional, IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class CreateModuleDto {
  @IsString({ message: 'El name debe ser un string' })
  @IsNotEmpty({ message: 'El name no puede estar vacío' })
  public name: string;

  @IsNumber({}, { message: 'El cost debe ser un número' })
  @IsNotEmpty({ message: 'El cost no puede estar vacío' })
  public cost: number;

  @IsString({ message: 'El slug debe ser un string' })
  @IsNotEmpty({ message: 'El slug no puede estar vacío' })
  public slug: string;

  @IsOptional()
  @IsBoolean({ message: 'El status debe ser un valor booleano' })
  public status: boolean;

  constructor() {
    this.status = true;
  }
}