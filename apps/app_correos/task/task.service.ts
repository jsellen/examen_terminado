import { CronJob } from 'cron';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { Pedido, PedidoDocument } from './model/pedido.schema';
import { Correo, CorreoDocument } from './model/correo.schema';
import { Notificacion, NotificacionDocument } from './model/notificacion.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AppCorreosController } from '../src/app_correos.controller';
import { EnviarEmailModule } from '../src/enviar_email/enviar_email.module';
import { EnviarEmailController } from '../src/enviar_email/enviar_email.controller';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { EnviarEmailService } from '../src/enviar_email/enviar_email.service';
import { MailService } from '@sendgrid/mail';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import nodemail from 'nodemailer';
import { EventPattern } from '@nestjs/microservices';
// import { AppCorreosService } from '../src/app_correos.service';

@Injectable()
export class TaskService {
  constructor(
    private schedulerRegistry: SchedulerRegistry) {
      console.log(process.env.TIME_SCHEDULE)
    }

  private readonly logger = new Logger(TaskService.name);
  
  @InjectModel(Pedido.name) private readonly pedidoModel: Model<PedidoDocument>;
  @InjectModel(Correo.name) private readonly correoModel: Model<CorreoDocument>; 
  @InjectModel(Notificacion.name) private readonly notificacionModel: Model<NotificacionDocument>;

  //@Inject(EnviarEmailService)  private readonly enviarEmailService: EnviarEmailService;
  @Inject(MailService)  private readonly sendgridClientMail: MailService
  
  
  // process.env.TIME_SCHEDULE
  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'notificaciones', })
   handleCron() {
    this.logger.debug('Tarea Programada');
    //Procesar los Pedidos de Notificacion

    this.deleteCron('notificaciones');
    this.addCronJobTime('tarea_sistema', process.env.TIEMPO_SCHEDULE);
  }

  async addCronJobTime(name: string, formato_Periodo: string) {
    const job = new CronJob(formato_Periodo, () => {
      this.logger.warn(`time (${formato_Periodo}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${formato_Periodo} seconds!`,
    );    
    const elem: any  = {
      "fecha_emision": '024-03-08T17:43:38.416Z',
      "nombre_evento": 'EVENTO_Sistema_INSTANTANEA3',
      "via_entrega": "Sistema",
      "tipo_notificacion": "Por Lote",
      "id_Usuario": "f85c0440-d451-4ce3-8a85-3a28c38409e0",
      "email": "jsellentorres@gmail.com",
      "proveedor_Correo": "SendGrid",
      "informacion_transmitir": "Prueba particular"
    }
    await this.procesarPedidos({filtrar:'por_Tiempo',filtrado_particular:{}},elem);
    //await this.Comprobar_Limites_por_Lotes(elem);
    return `job ${name} added for each minute at ${formato_Periodo} seconds!`;
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

   async Comprobar_Limites_por_Lotes(elem : CreatePedidoDto) {
    // -------------   Creacion listado Correos_Por_Lotes 

    let Por_Lotes = [];    
    let result = {}

    var comun = [ 
      { "tipo_notificacion": 'Por Lote' }, 
      { "nombre_evento": elem.nombre_evento }
    ] ;
    var objectCorreo = [
      { "via_entrega": 'Correo' }, 
      { "email": elem.email } 
      ];
    var objectSistema = [
        { "via_entrega": 'Sistema' }, 
        { "id_Usuario": elem.id_Usuario } 
      ];


    let filtrado_particular = {}

    if (elem.via_entrega === 'Correo'){
      filtrado_particular =
        { $and: [ 
          { "procesada": false },
          { "tipo_notificacion": 'Por Lote' }, 
          { "nombre_evento": elem.nombre_evento }, 
          { "via_entrega": 'Correo' }, 
          { "email": elem.email } 
        ] }      
    } else if (elem.via_entrega === 'Sistema'){
      filtrado_particular =
        { $and: [ 
          { "procesada": false },
          { "tipo_notificacion": 'Por Lote' },
          { "nombre_evento": elem.nombre_evento }, 
          { "via_entrega": 'Sistema' }, 
          { "id_Usuario": elem.id_Usuario } 
        ] } 
    }
    Por_Lotes = await  this.pedidoModel.find(filtrado_particular);

    console.log(Por_Lotes.length); 
    let cantidad_limite: number = +process.env.CANT_MIN_LOTE_SCHEDULE;
    let cant : number  = Por_Lotes.length;
    if (cant >= cantidad_limite) {
      //----  Ejecutar Microservicio
      console.log('Ejecutar Microservicio ')
      let  particular : any = elem
      await this.procesarPedidos({filtrar:'por_Cantidad',filtrado_particular},particular);
    }else  
      console.log('no llega al Limite Minimo por Lote ') 
   

    // --- Elimino la tarea programada anterior (notificaciones)
    // this.deleteCron('tarea_sistema');
    //--- Hecho andar, La nueva tarea programada con igual nombre que la anterior (notificaciones)
    this.logger.debug('Tarea Programada del sistema ->', process.env.TIEMPO_SCHEDULE);
    // this.addCronJobTime('tarea_sistema', process.env.TIEMPO_SCHEDULE);
  }


/**  
      Proceso de Filtrado para Todas u otra particularidad relacionada con las Notificaciones que recibe le sistema 
*/
  async procesarPedidos(filtrado = {filtrar:'por_Tiempo',filtrado_particular:{}},particular: CreatePedidoDto) {
    console.log('inicio de procesamiento');
    let Correos = [];
    let  Sistemas = [];
    let Sistema_Por_Lotes = [];
    let Correos_Por_Lotes = [];
    if (filtrado.filtrar ==='por_Tiempo') {
        // -------------   Creacion listado Correos_Instantaneas 
        const Correos_Instantaneas = await  this.pedidoModel
            .find(
              // .select('fecha_emision')
              // .select('nombre_evento')
              // .select('email')
              // .select('proveedor_Correo')
              // .select('informacion_transmitir')
              // .where('procesada', false)
              // .where('tipo_notificacion', 'Instantanea')
              // .where('via_entrega', 'Correo')
              // .sort('tipo_notificacion').exec(); 
              { $and: [ 
                { "procesada": false },  
                { "via_entrega": 'Correo' }, 
                { "tipo_notificacion": 'Instantanea' },
              ] });        
        for(let i = 0; i < Correos_Instantaneas.length ; i++){
          const { fecha_emision,nombre_evento, email, proveedor_Correo, informacion_transmitir } = Correos_Instantaneas[i];
          Correos.push({nombre_evento, email,proveedor_Correo,mensaje:informacion_transmitir,fecha_emision,'filtro':'Correos_Instantaneas'});
        }
        //console.log('//Listado de Correos Via-> Instantaneas ',Correos);

        // // -------------   Creacion listado Sistema_Instantaneas  
        const Sistema_Instantaneas = await  this.pedidoModel
          .find(
          // .select('id_Usuario')
          // .select('informacion_transmitir')
          // .select('fecha_emision')
          // .select('nombre_evento')
          // .where('procesada', false)
          // .where('tipo_notificacion', 'Instantanea')
          // .where('via_entrega', 'Sistema')
          // .sort('tipo_notificacion').exec();
          { $and: [ 
            { "procesada": false }, 
            { "via_entrega": 'Sistema' }, 
            { "tipo_notificacion": 'Instantanea' },
          ] });
        for(let i = 0; i < Sistema_Instantaneas.length ; i++){
          const { id_Usuario,informacion_transmitir,fecha_emision,nombre_evento } = Sistema_Instantaneas[i];
          Sistemas.push({id_Usuario,mensaje:informacion_transmitir,fecha_emision,'filtro':'Sistema_Instantaneas',nombre_evento});
        }
        //console.log('//Listado de Sistemas Via-> Instantaneas ',Sistemas);
        

        // //------   Por_Lotes 

        // -------------   Creacion listado Correos_Por_Lotes 
        Correos_Por_Lotes = await  this.pedidoModel
          .find(
          // .select('email')
          // .select('nombre_evento')
          // .select('proveedor_Correo')
          // .select('informacion_transmitir')
          // .select('fecha_emision')
          // .where('procesada', false)
          // .where('tipo_notificacion', 'Por Lote')
          // .where('via_entrega', 'Correo')
          // .sort('nombre_evento').exec();
          { $and: [ 
            { "procesada": false }, 
            { "via_entrega": 'Correo' }, 
            { "tipo_notificacion": 'Por Lote' },
          ] });   
 
        Sistema_Por_Lotes = await  this.pedidoModel
        .find(
        // .select('id_Usuario')
        // .select('informacion_transmitir')
        // .select('nombre_evento')
        // .select('fecha_emision')
        // .where('procesada', false)
        // .where('tipo_notificacion', 'Por Lote')
        // .where('via_entrega', 'Sistema')
        // .sort('nombre_evento').exec();
        { $and: [ 
          { "procesada": false }, 
          { "via_entrega": 'Sistema' }, 
          { "tipo_notificacion": 'Por Lote' },
        ] });  
    } else {
      // --  Procesamiento individual
        // //------   Por_Lotes 

        // -------------   Creacion listado Correos_Por_Lotes 
        // ----Uno de los arreglos tomara valores
        if (particular.via_entrega ===  "Correo")
          Correos_Por_Lotes = await  this.pedidoModel.find(filtrado.filtrado_particular);  
        else
        if (particular.via_entrega ===  "Sistema")
          Sistema_Por_Lotes = await  this.pedidoModel.find(filtrado.filtrado_particular);  
        // console.log('//------Listado de Correos',filtrado.filtrado_particular);
        // console.log('//------Listado de Correos',Correos_Por_Lotes);
        // console.log('//------Listado de Correos',Sistema_Por_Lotes);
    }       

    Correos_Por_Lotes.forEach((linea, i) => {
      const { email,proveedor_Correo,nombre_evento,informacion_transmitir,fecha_emision } = linea;      
      const llave = `${email}${nombre_evento}`;
      // if (Correos.findIndex())
      let arr_mensaje = []
      let filtered = Correos_Por_Lotes.filter((pedido) => {
          return pedido.email === email && pedido.nombre_evento === nombre_evento;
      }).forEach((value, key) => {
          arr_mensaje.push(value.informacion_transmitir);
      });  
      let mensaje = arr_mensaje.join(',');
      
      Correos_Por_Lotes.shift();
      Correos.push({email,proveedor_Correo,mensaje,fecha_emision,'filtro':'Correos_Por_Lotes',nombre_evento});
    })

    //console.log('//------Listado de Correos',Correos);
    //----- Proceso de Guardar listado de Correos
    if (Correos.length > 0) {      
      const resp = await this.procesamiento_Correos(Correos);
      //console.log('respuesta de notificaciones', resp);
      let filtro = {};
      if (filtrado.filtrar ==='por_Tiempo') {
         filtro = { 
          procesada: false, 
          via_entrega: 'Correo' 
        }
      }else{
        filtro = { 
          procesada: false, 
          via_entrega: 'Correo' ,
          "tipo_notificacion": 'Por Lote',
          email: particular.email,
          nombre_evento : particular.nombre_evento,
        }
      } 

      if (resp) {
          try {   
            const result = await this.pedidoModel.updateMany(filtro , { procesada: true });

            //console.log('actualizo todas peticiones por Correo');
          } catch (error) {
            //console.log('Hubo un error', error);
          }
      }
    } 

    Sistema_Por_Lotes.forEach((linea, i) => {
    const { id_Usuario,nombre_evento,informacion_transmitir,fecha_emision } = linea;      

          let arr_mensaje = []
          let filtered = Sistema_Por_Lotes.filter((pedido) => {
              return pedido.id_Usuario === id_Usuario && pedido.nombre_evento === nombre_evento;
          }).forEach((value, key) => {
              arr_mensaje.push(value.informacion_transmitir);
          });  
          let mensaje = arr_mensaje.join(',');
          
          Sistema_Por_Lotes.shift();
          Sistemas.push({id_Usuario,mensaje,fecha_emision,'filtro':'Sistema_Por_Lotes',nombre_evento});
    })   
 
  //----- Proceso de Guardar Notificaciones al Sistema
  if (Sistemas.length > 0) {      
    const resp = await this.procesamiento_Sistemas(Sistemas);
    console.log('respuesta de notificaciones', resp);
    let filtro = {};
    if (filtrado.filtrar ==='por_Tiempo') {
       filtro = { 
        procesada: false, 
        via_entrega: 'Sistema' 
      }
    }else{
      filtro = { 
        procesada: false, 
        via_entrega: 'Sistema' ,
        "tipo_notificacion": 'Por Lote',
        id_Usuario: particular.id_Usuario,
        nombre_evento : particular.nombre_evento,
      }
    }     
    if (resp) {
        try {   
          const result = await this.pedidoModel.updateMany(filtro, { procesada: true });
          console.log('actualizo todas peticiones por Sistema');
        } catch (error) {
          //return {error : true, mensaje : error};
          console.log('Hubo un error', error);
        }
    }
  }
  // console.log('//------Listado de Sistemas',Sistemas);

  // console.log('Fin  del insercion de la lista de Correos');

   console.log('final de procesamiento');
    
  }

async procesamiento_Correos(listado : any[]):Promise<any> {
    //console.log('Comienzo del insercion de los Correo');
    try {
        listado.forEach( async (noti, i) => {
      
          // Busca si ya existe el pedido
          const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = noti;
          //console.log(noti);
          const notiExist = await this.correoModel.find({
            fecha_emision:fecha_emision,nombre_evento:nombre_evento
          });
          //console.log(`${fecha_emision},${nombre_evento}-> `,notiExist);
          if (notiExist.length === 0){ 
            //console.log('guardar el correo');
            const pedidoCreated = await this.correoModel.create(noti); 
            //--- Enviar Correo
            console.log(proveedor_Correo);
            
            if (proveedor_Correo === 'Sendgrid') {
              console.log('ejecutando envio de correo por SenGrid');
              //await this.send_mail_Sendgrid(noti)
            }
            else 
            if (proveedor_Correo === 'Mailgun')  {
              console.log('ejecutando envio de correo por Mailgun');
              //await this.send_mail_Mailgun(noti)
            }
            else 
            if (proveedor_Correo === 'Gmail')    {
              console.log('ejecutando envio de correo por Mailgun');
              //await this.send_mail_NodeMailer_Gmail(noti);
            }
            
          } else{
            console.log('ya existe el correo');
          } 
        })
        console.log('todo salio bien los Correo');
        
        return true
      } catch (error) {
        return false;
      }
        
  }

async procesamiento_Sistemas(listado : any[]):Promise<any> {
    console.log('Comienzo del insercion de las Notidicaciones por Sistema');
  
    try {
        listado.forEach( async (noti, i) => {
      
          // Busca si ya existe el pedido
          const { fecha_emision,nombre_evento, informacion_transmitir } = noti;
          //console.log(noti);
          const notiExist = await this.notificacionModel.find({
            fecha_emision:fecha_emision,nombre_evento:nombre_evento
          });
          //console.log(`${fecha_emision},${nombre_evento}-> `,notiExist);
          if (notiExist.length === 0){ 
            console.log('guardar notificacion');
            const pedidoCreated = await this.notificacionModel.create(noti); 
          } else{
            console.log('ya existe la notificacion');
          } 
        })
        
        console.log('todo salio bien');
        return true
      } catch (error) {
        return false;
      }
    }
     
    
    ///  Envio de Correo

    
  async send_mail_Sendgrid(data: any):Promise<boolean>{
          console.log('correo Sendgrid - ')      
      //--- desagregar los campos
      const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = data;
      //----
      //const sendgridClientMail = new MailService();
      console.log(process.env.SENDGRID_API_KEY)
      this.sendgridClientMail.setApiKey(process.env.SENDGRID_API_KEY);
      //----
      const msg = {
        to: email,
        from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
        subject: `${fecha_emision} - ${nombre_evento}`,
        text: mensaje,
      };
      console.log(msg);
      //await this.sendgridClientMail.send(msg);
      // //ES6
      // sendgridClientMail
      //   .send(msg)
      //   .then(() => {}, error => {
      //     console.error(error);
      
      //     if (error.response) {
      //       console.error(error.response.body)
      //     }
      //   });
      // //ES8
      try {
          await this.sendgridClientMail.send(msg);
          return true
        } catch (error) {
          console.error(error);
      
          if (error.response) {
            console.error(error.response.body)
          }
          return false
        }      
  }


   async send_mail_Mailgun(data: any):Promise<boolean>{
    
    console.log('correo Mailgun - ')
      
    const MAILGUN_KEY    = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_TU_DOMINOIO;  
    const client = new Mailgun(FormData).client({
        username: 'api',
        key: MAILGUN_KEY,
    });
    /*    mailgun secret key
    process.env.MAILGUN_API_KEY;
    process.env.MAILGUN_TU_DOMINOIO; 
    */

    //--- desagregar los campos
    const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = data;
    const messageData = {
      to: email,
      from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
      subject: `${fecha_emision} - ${nombre_evento}`,
      text: mensaje,
    };           

    client.messages
      .create(MAILGUN_DOMAIN, messageData)
      .then((res) => {
        console.log(res);
        return true
      })
      .catch((err) => {
        console.error(err);
        return false
      });

      try {
        client.messages.create(MAILGUN_DOMAIN, messageData)
        return true;
      } catch (error) {
        console.error('Error al enviar el correo electronico', error);
        return false;
      }
  }


  async send_mail_NodeMailer_Gmail(data: any):Promise<boolean>{
    console.log('correo Gmail - ')
    const transporter = nodemail.createTransport({
      service: 'Gmail',
      auth : {
          user: process.env.TU_CORREO_GMAIL,
          pass: process.env.TU_PASSWORD_CORREO_GMAIL     
      }
    });
    //--- desagregar los campos
    const { fecha_emision,nombre_evento,email,proveedor_Correo, mensaje } = data;
    try {
      const info = await transporter.sendMail({
        to: email,
        from: process.env.TU_CORREO_GMAIL, // Use the email address or domain you verified above
        subject: `${fecha_emision} - ${nombre_evento}`,
        text: mensaje,
      });
      console.log('correo electronico enciado', info.messageId);
      return true;
    } catch (error) {
      console.error('Error al enviar el correo electronico', error);
      return false;
    }
  }


}
