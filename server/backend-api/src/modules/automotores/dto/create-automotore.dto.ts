import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min, Max, Matches, Length, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAutomotoreDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/, {
    message: 'El dominio debe tener formato AAA000 o AA000AA'
  })
  dominio: string;

  @IsString()
  @IsOptional()
  @Length(1, 25, { message: 'El número de chasis debe tener entre 1 y 25 caracteres' })
  numero_chasis?: string;

  @IsString()
  @IsOptional()
  @Length(1, 25, { message: 'El número de motor debe tener entre 1 y 25 caracteres' })
  numero_motor?: string;

  @IsString()
  @IsOptional()
  @Length(1, 40, { message: 'El color debe tener entre 1 y 40 caracteres' })
  color?: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(190001, { message: 'La fecha de fabricación debe ser mayor a 190001' })
  @Max(999912, { message: 'La fecha de fabricación debe ser menor a 999912' })
  @Transform(({ value }) => parseInt(value))
  fecha_fabricacion: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  spoId: number;
}
