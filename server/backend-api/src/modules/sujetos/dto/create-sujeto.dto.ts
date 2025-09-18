import { IsNotEmpty, IsString, MaxLength, MinLength, Matches } from "class-validator";

export class CreateSujetoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(11)
    @MaxLength(11)
    @Matches(/^[0-9]{11}$/, { message: 'CUIT debe contener exactamente 11 dígitos numéricos' })
    spoCuit: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    spoDenominacion: string;
}
