import { CronJob } from 'cron';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
//import { PedidosService } from '../pedidos/pedidos.service';

@Injectable()
export class TaskService {
  constructor(
    private schedulerRegistry: SchedulerRegistry) {
    }

  private readonly logger = new Logger(TaskService.name);
  //@Inject(PedidosService) private readonly pedidosService : PedidosService;
  
  
  // @Cron(CronExpression.EVERY_30_SECONDS, { name: 'notificaciones', })
  // async handleCron() {
  //   this.logger.debug('Tarea Programada ');
  //   this.deleteCron('notificaciones');
  //   this.addCronJobTime('prueba', process.env.TIEMPO_SCHEDULE);
  // }

  addCronJobTime(name: string, formato_Periodo: string) {
    const job = new CronJob(formato_Periodo, () => {
      this.logger.warn(`time (${formato_Periodo}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${formato_Periodo} seconds!`,
    );
    return `job ${name} added for each minute at ${formato_Periodo} seconds!`;
  }

  addCronJob(name: string, seconds: number) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds!`,
    );
    return `job ${name} added for each minute at ${seconds} seconds!`;
  }

  getCrons() {
    const jobsList = [];
    const jobs = this.schedulerRegistry.getCronJobs();
    // jobs.forEach((value, key) => {
    //   let next;
    //   try {
    //     next = new Date(value.nextDates().ts);
    //   } catch (e) {
    //     next = 'error: next fire date is in the past!';
    //   }
    //   this.logger.log(`job: ${key} -> next: ${next}`);
    //   jobsList.push({ name: key, time: next });
    // });
    return jobsList;
  }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
    return `job ${name} deleted!`;
  }
}
