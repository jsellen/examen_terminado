import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  nombre_completo: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
