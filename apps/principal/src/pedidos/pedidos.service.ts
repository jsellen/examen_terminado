import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido, PedidoDocument } from './model/pedido.schema';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
// import { CorreosService } from '../correos/correos.service';
import { ClientProxy } from '@nestjs/microservices';
// import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';



@Injectable()
export class PedidosService {

    constructor(
      @InjectModel(Pedido.name) private readonly pedidoModel: Model<PedidoDocument>,
      @Inject('MATH_SERVICE')   private readonly comprobarCantidadLotes: ClientProxy
    ) {}  
    
   //@Inject(NotificacionesService) private readonly notificacionesService : NotificacionesService;
   //@Inject(CorreosService) private readonly correosService : CorreosService;

   create(_createPedidoDto: CreatePedidoDto) {
    // createPedidoDto trae en BODY los datos
    const pedidoCreated = this.pedidoModel.create(_createPedidoDto); 
    //----  Si se guarda un pedido por Lote
    //----  Comprobamos si llega a la cantidad minima por Lote 
    if (_createPedidoDto.tipo_notificacion == 'Por Lote') {
       //this.Comprobar_Limites_por_Lotes(_createPedidoDto);
       console.log('Llamar al Microservicio')
       this.comprobarCantidadLotes.emit('Limites_por_Lotes',_createPedidoDto)
    }
    return pedidoCreated;
  }

  async findAll() {
    const list = await this.pedidoModel.find();
    return list
  }

  async findOne(id: string) {
    const list = await this.pedidoModel.findById(id);
    return list
  }

  async update(id: string, _updateUserDto:UpdatePedidoDto) {
    const list = await this.pedidoModel.findByIdAndUpdate(id,_updateUserDto);
    return list
  }

  async remove(id: string) {
    try {
    const list = await this.pedidoModel.findByIdAndDelete(id)
    return list      
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

}
