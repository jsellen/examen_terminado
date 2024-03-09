import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { UpdateNotificacioneDto } from './dto/update-notificacione.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notificacion, NotificacionDocument } from './modelo/notificacion.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(Notificacion.name) private readonly notificacionModel: Model<NotificacionDocument>
  ) {}  
  
  // async insertarDesdeProcesamiento(listado : any[]):Promise<any> {
  //   console.log('Comienzo del insercion de las Notidicaciones por Sistema');
  
  //   try {
  //       listado.forEach( async (noti, i) => {
      
  //         // Busca si ya existe el pedido
  //         const { fecha_emision,nombre_evento, informacion_transmitir } = noti;
  //         //console.log(noti);
  //         const notiExist = await this.notificacionModel.find({
  //           fecha_emision:fecha_emision,nombre_evento:nombre_evento
  //         });
  //         //console.log(`${fecha_emision},${nombre_evento}-> `,notiExist);
  //         if (notiExist.length === 0){ 
  //           console.log('guardar notificacion');
  //           const pedidoCreated = await this.notificacionModel.create(noti); 
  //         } else{
  //           console.log('ya existe la notificacion');
  //         } 
  //       })
        
  //       console.log('todo salio bien');
  //       return true
  //     } catch (error) {
  //       return false;
  //     }
        
  // }

  

  async findAll() {
    const list = await this.notificacionModel.find();
    return list
  }

  async findOne(id: string) {
    const resp = await this.notificacionModel.updateOne({_id: id} , { estado: true });
    return resp
  }

  async update(id: string, _updateNotificacioneDto:UpdateNotificacioneDto) {
    const list = await this.notificacionModel.findByIdAndUpdate(id,_updateNotificacioneDto);
    return list
  }

  async remove(id: string) {
    try {
    const list = await this.notificacionModel.findByIdAndDelete(id)
    return list      
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
