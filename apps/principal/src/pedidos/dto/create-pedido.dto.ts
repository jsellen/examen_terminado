import { IsNotEmpty, IsEmail, IsEnum, ValidateIf, IsDate, IsString, IsBoolean, IsOptional, isString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { proveedoresCorreo, tipoEntraga, tipoNotificacion } from "../constants/api.enums";
import { v4 as uuidv4 } from 'uuid';
import { Type } from "class-transformer";

export class CreatePedidoDto {
    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty({ message: 'La Fecha de Emision es obligatorio'})
    readonly fecha_emision: Date;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'El Nombre del Evento es obligatorio'})
     nombre_evento: string;
  
    @ApiProperty()
    @IsString()
    via_entrega: string;

    @ApiProperty()
    @IsString()
    tipo_notificacion: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsNotEmpty( {message: 'Es obligatorio el ID, ya que Tipo de Entrega por Sistema'})      
     id_Usuario: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty( {message: 'Es obligatorio el correo, ya que Tipo de Entrega por Email'})  
    email: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    proveedor_Correo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty( {message: 'Es obligatorio la informacion a transmitir'})
    informacion_transmitir : string
  
}
