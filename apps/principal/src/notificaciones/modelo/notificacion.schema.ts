import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, isDate, IsEnum, IsNotEmpty } from 'class-validator';
import { Date, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export type NotificacionDocument = Notificacion & Document;


@Schema({ timestamps: true })
export class Notificacion {
  @ApiProperty()
  @Prop()
  @IsDate()
  @IsNotEmpty({ message: 'La Fecha de Emision es obligatorio'})
  fecha_emision: Date;
  
  @ApiProperty()
  @Prop()
  @IsNotEmpty({ message: 'El Nombre del Evento es obligatorio'})
  nombre_evento: string;

  @ApiProperty()
  @Prop({default: uuidv4 })
  @IsNotEmpty( {message: 'Es obligatorio el ID, ya que Tipo de Entrega por Sistema'})      
  id_Usuario: string;

  @ApiProperty()
  @IsBoolean()
  @Prop({default: false})
  estado: boolean


  @ApiProperty()
  @Prop()
  @IsNotEmpty( {message: 'Es obligatorio la informacion a transmitir'})
  mensaje : string

}
export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);