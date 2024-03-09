import { IsNotEmpty, IsEmail, IsEnum, ValidateIf, IsDate, IsString, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { Prop } from "@nestjs/mongoose";

export class CreateNotificacioneDto {
  @ApiProperty()
  @Prop()
  @IsDate()
  @IsOptional()
  @IsNotEmpty({ message: 'La Fecha de Emision es obligatorio'})
  fecha_emision: Date;
  
  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsNotEmpty({ message: 'El Nombre del Evento es obligatorio'})
  nombre_evento: string;

  @ApiProperty()
  @Prop({default: uuidv4 })
  @IsOptional()
  @IsNotEmpty( {message: 'Es obligatorio el ID, ya que Tipo de Entrega por Sistema'})      
  id_Usuario: string;

  @ApiProperty()
  @Prop()
  @IsOptional()
  @IsNotEmpty( {message: 'Es obligatorio la informacion a transmitir'})
  mensaje : string


  @ApiProperty()
  @IsBoolean()
  @Prop({default: false})
  @IsNotEmpty()
  estado: boolean
}

