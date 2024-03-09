import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, isDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Date, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { proveedoresCorreo, tipoEntraga, tipoNotificacion } from '../constants/api.enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export type PedidoDocument = Pedido & Document;


@Schema({ timestamps: true })
export class Pedido {
  
  @Type(() => Date)
  @Prop()
  @IsDate()
  @IsNotEmpty({ message: 'La Fecha de Emision es obligatorio'})
  readonly fecha_emision: Date;

  
  
  @Prop()
  @IsNotEmpty({ message: 'El Nombre del Evento es obligatorio'})
  nombre_evento: string;

  
  @Prop({ type: String, enum: tipoEntraga, default: tipoEntraga.Correo })
  @IsEnum(tipoEntraga)
  via_entrega: string;

  
  @Prop({ type: String, enum: tipoNotificacion, default: tipoNotificacion.Instantanea })
  @IsEnum(tipoNotificacion)
  tipo_notificacion: string;

  
  @Prop()
  @IsOptional()
  @ValidateIf(o => o.Via_Entrega === tipoEntraga.Sistema)
  @IsNotEmpty( {message: 'Es obligatorio el ID, ya que Tipo de Entrega por Sistema'})      
  id_Usuario: string;

  
  @Prop()
  @IsOptional()
  @ValidateIf(o => o.Via_Entrega === tipoEntraga.Correo)
  @IsNotEmpty( {message: 'Es obligatorio el correo, ya que Tipo de Entrega por Email'})  
  email: string;

  
  @Prop({ type: String, enum: proveedoresCorreo, default: proveedoresCorreo.Gmail })
  @IsEnum(proveedoresCorreo)
  proveedor_Correo: string;

  
  @Prop()
  @IsNotEmpty( {message: 'Es obligatorio la informacion a transmitir'})
  informacion_transmitir : string

  @IsBoolean()
  @IsOptional()
  @Prop({default: false})
  procesada: boolean
}
export const PedidoSchema = SchemaFactory.createForClass(Pedido);
