import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, isDate, IsEnum, IsNotEmpty } from 'class-validator';
import { Date, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export type CorreoDocument = Correo & Document;


@Schema({ timestamps: true })
export class Correo {

  @Prop()
  @IsDate()
  @IsNotEmpty()
  fecha_emision: Date;
  

  @Prop()
  @IsNotEmpty()
  nombre_evento: string;


  @Prop()
  @IsNotEmpty()  
  email: string;


  @Prop()
  @IsNotEmpty()  
  proveedor_Correo: string;


  @IsBoolean()
  @Prop({default: false})
  estado: boolean



  @Prop()
  @IsNotEmpty()
  mensaje : string

}
export const CorreoSchema = SchemaFactory.createForClass(Correo);