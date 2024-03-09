import { Inject, Injectable } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { MailService } from '@sendgrid/mail';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import nodemail from 'nodemailer';

@Injectable()
export class AppCorreosService {
  constructor (
      //@Inject(MailService)  private readonly sendgridClientMail: MailService
    ){}


  // getHello(): string {
  //   return 'Hello World!';
  // }

  // async send_mail_Sendgrid(data: any):Promise<boolean>{
  //         console.log('correo Sendgrid - ')      
  //     //--- desagregar los campos
  //     const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = data;
  //     //----
  //     //const sendgridClientMail = new MailService();
  //     console.log(process.env.SENDGRID_API_KEY)
  //     this.sendgridClientMail.setApiKey(process.env.SENDGRID_API_KEY);
  //     //----
  //     const msg = {
  //       to: email,
  //       from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
  //       subject: `${fecha_emision} - ${nombre_evento}`,
  //       text: mensaje,
  //     };
  //     console.log(msg);
  //     //await this.sendgridClientMail.send(msg);
  //     // //ES6
  //     // sendgridClientMail
  //     //   .send(msg)
  //     //   .then(() => {}, error => {
  //     //     console.error(error);
      
  //     //     if (error.response) {
  //     //       console.error(error.response.body)
  //     //     }
  //     //   });
  //     // //ES8
  //     try {
  //         await this.sendgridClientMail.send(msg);
  //         return true
  //       } catch (error) {
  //         console.error(error);
      
  //         if (error.response) {
  //           console.error(error.response.body)
  //         }
  //         return false
  //       }      
  // }


  //  async send_mail_Mailgun(data: any):Promise<boolean>{
    
  //   console.log('correo Mailgun - ')
      
  //   const MAILGUN_KEY    = process.env.MAILGUN_API_KEY;
  //   const MAILGUN_DOMAIN = process.env.MAILGUN_TU_DOMINOIO;  
  //   const client = new Mailgun(FormData).client({
  //       username: 'api',
  //       key: MAILGUN_KEY,
  //   });
  //   /*    mailgun secret key
  //   process.env.MAILGUN_API_KEY;
  //   process.env.MAILGUN_TU_DOMINOIO; 
  //   */

  //   //--- desagregar los campos
  //   const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = data;
  //   const messageData = {
  //     to: email,
  //     from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
  //     subject: `${fecha_emision} - ${nombre_evento}`,
  //     text: mensaje,
  //   };           

  //   client.messages
  //     .create(MAILGUN_DOMAIN, messageData)
  //     .then((res) => {
  //       console.log(res);
  //       return true
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return false
  //     });

  //     try {
  //       client.messages.create(MAILGUN_DOMAIN, messageData)
  //       return true;
  //     } catch (error) {
  //       console.error('Error al enviar el correo electronico', error);
  //       return false;
  //     }
  // }


  // async send_mail_NodeMailer_Gmail(data: any):Promise<boolean>{
  //   console.log('correo Gmail - ')
  //   const transporter = nodemail.createTransport({
  //     service: 'Gmail',
  //     auth : {
  //         user: process.env.TU_CORREO_GMAIL,
  //         pass: process.env.TU_PASSWORD_CORREO_GMAIL     
  //     }
  //   });
  //   //--- desagregar los campos
  //   const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = data;
  //   try {
  //     const info = await transporter.sendMail({
  //       to: email,
  //       from: process.env.TU_CORREO_GMAIL, // Use the email address or domain you verified above
  //       subject: `${fecha_emision} - ${nombre_evento}`,
  //       text: mensaje,
  //     });
  //     console.log('correo electronico enciado', info.messageId);
  //     return true;
  //   } catch (error) {
  //     console.error('Error al enviar el correo electronico', error);
  //     return false;
  //   }
  // }
}
