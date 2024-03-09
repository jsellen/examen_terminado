import { Module } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { CorreosController } from './correos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Correo, CorreoSchema } from './modelo/correo.schema';
// import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Correo.name,
        schema: CorreoSchema,
      },
    ]),
    // ClientsModule.register([
    //   {
    //     name: 'MATH_SERVICE',
    //     transport: Transport.TCP,
    //   },
    // ]),
  ],
  controllers: [CorreosController],
  providers: [CorreosService],
  exports: [CorreosService],
})
export class CorreosModule {}
