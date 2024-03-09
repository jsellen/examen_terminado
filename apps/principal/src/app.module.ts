import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PedidosModule } from './pedidos/pedidos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { CorreosModule } from './correos/correos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    //MongooseModule.forRoot('mongodb://localhost/tarea'),
    UsersModule,
    TaskModule,
    // ClientsModule.register([
    //   { name: 'PRUEBA_SERVICE', 
    //     transport: Transport.TCP, 
    //   },
    // ]),
    PedidosModule,
    NotificacionesModule,
    CorreosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 