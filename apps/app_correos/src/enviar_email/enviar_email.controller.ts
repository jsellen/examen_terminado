import { Controller } from '@nestjs/common';
import { EnviarEmailService } from './enviar_email.service';

@Controller('enviar-email')
export class EnviarEmailController {
  constructor(private readonly appCorreosService: EnviarEmailService) {}

  // @Get()
  // getHello(): string {
  //   return this.appCorreosService.getHello();
  // }

 // @EventPattern('new_mail')
  //@MessagePattern({ cmd: 'new_mail' })
  async getHello(user : any) {
    console.log('Hello World!', user) ;
  }

  // //@EventPattern('Sendgrid')
  // async send_mail_Sendgrid(data: any):Promise<boolean>{
  //   //console.log('Hello World!', data) ;
  //   return this.appCorreosService.send_mail_Sendgrid(data)
  // }

  // //@EventPattern('Mailgun')
  // async send_mail_Mailgun(data: any):Promise<boolean>{
  //   //console.log('Hello World!', data) ;
  //   return this.appCorreosService.send_mail_Mailgun(data)
  // }

  // //@EventPattern('Gmail')
  // async send_mail_NodeMailer_Gmail(data: any):Promise<boolean>{
  //   //console.log('Hello World!', data) ;
  //   return this.appCorreosService.send_mail_NodeMailer_Gmail(data)
  // }

}
