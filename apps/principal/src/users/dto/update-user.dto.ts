import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    password: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsOptional()
    nombre_completo: string;
}
