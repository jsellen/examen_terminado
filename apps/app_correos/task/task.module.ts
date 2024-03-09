import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
//import { PedidosModule } from '../pedidos/pedidos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Pedido, PedidoSchema } from './model/pedido.schema';
import { Correo, CorreoSchema } from './model/correo.schema';
import { Notificacion, NotificacionSchema } from './model/notificacion.schema';
import { EnviarEmailService } from '../src/enviar_email/enviar_email.service';
import { MailService } from '@sendgrid/mail';

@Module({
  imports:[ 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      {
        name: Pedido.name,
        schema: PedidoSchema,
      },
      {
        name: Correo.name,
        schema: CorreoSchema,
      },
      {
        name: Notificacion.name,
        schema: NotificacionSchema,
      },
    ]),
    
  ],
  controllers: [TaskController],
  providers: [TaskService, MailService],
})
export class TaskModule {}
