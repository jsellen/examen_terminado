import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notificacion, NotificacionSchema } from './modelo/notificacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notificacion.name,
        schema: NotificacionSchema,
      },
    ])
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
