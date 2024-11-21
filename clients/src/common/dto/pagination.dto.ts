import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsPositive({ message: 'La página debe ser un número positivo' })
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Type(() => Number)
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number = 1;

  @IsPositive({ message: 'El límite debe ser un número positivo' })
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Type(() => Number)
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite debe ser menor a 100' })
  limit?: number = 10;
}
