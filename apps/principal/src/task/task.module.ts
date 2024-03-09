import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    PedidosModule,  
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
