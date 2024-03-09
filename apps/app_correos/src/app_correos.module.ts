import { Module } from '@nestjs/common';
import { AppCorreosController } from './app_correos.controller';
import { AppCorreosService } from './app_correos.service';
import { MailService } from '@sendgrid/mail';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from '../task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
// import { PedidosModule } from './pedidos/pedidos.module';
import { EnviarEmailModule } from './enviar_email/enviar_email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TaskModule,
    EnviarEmailModule,
    // PedidosModule
  ],
  controllers: [AppCorreosController],
  providers: [AppCorreosService],
  exports: [AppCorreosService],
})
export class AppCorreosModule {}
