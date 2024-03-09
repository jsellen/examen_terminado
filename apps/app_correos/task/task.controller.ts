import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
//import { ApiTags } from '@nestjs/swagger';
import { CronDto } from './dto/task.dto';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { EventPattern } from '@nestjs/microservices';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @EventPattern('Limites_por_Lotes')
  Comprobar_Limites_por_Lotes(elem : CreatePedidoDto) {
    return this.taskService.Comprobar_Limites_por_Lotes(elem);
  }

  // @Post()
  // addCronJob(@Body() cronDto: CronDto) {
  //   const { name, seconds } = cronDto;
  //   return this.taskService.addCronJob(name, seconds);
  // }

  // @Get()
  // getCronsJobs() {
  //   return this.taskService.getCrons();
  // }

  // @Delete(':name')
  // removeCronJob(@Param('name') name: string) {
  //   return this.taskService.deleteCron(name);
  // }
}
