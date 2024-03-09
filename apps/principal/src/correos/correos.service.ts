import { Inject, Injectable } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Correo, CorreoDocument } from './modelo/correo.schema';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CorreosService {
  constructor(
    @InjectModel(Correo.name) private readonly correoModel: Model<CorreoDocument>,
    // @Inject('MATH_SERVICE') private clientMail:ClientProxy
  ) {}  

  
  // async insertarDesdeProcesamiento(listado : any[]):Promise<any> {
  //   //console.log('Comienzo del insercion de los Correo');
  //   try {
  //       listado.forEach( async (noti, i) => {
      
  //         // Busca si ya existe el pedido
  //         const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = noti;
  //         //console.log(noti);
  //         const notiExist = await this.correoModel.find({
  //           fecha_emision:fecha_emision,nombre_evento:nombre_evento
  //         });
  //         //console.log(`${fecha_emision},${nombre_evento}-> `,notiExist);
  //         if (notiExist.length === 0){ 
  //           //console.log('guardar el correo');
  //           const pedidoCreated = await this.correoModel.create(noti); 
  //           //--- Enviar Correo
  //           console.log(proveedor_Correo);
            
  //           if (proveedor_Correo === 'Sendgrid') this.clientMail.emit('Sendgrid',noti)
  //           else 
  //           if (proveedor_Correo === 'Mailgun')  this.clientMail.emit('Mailgun',noti)
  //           else 
  //           if (proveedor_Correo === 'Gmail')    this.clientMail.emit('Gmail',noti);
            
  //         } else{
  //           //console.log('ya existe el correo');
  //         } 
  //       })
  //       console.log('todo salio bien los Correo');
        
  //       return true
  //     } catch (error) {
  //       return false;
  //     }
        
  // }

}
