import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class AppService {
    //@Inject('PRUEBA_SERVICE') private clientMail: ClientProxy
    constructor() {}
    
  // newUser(user: any){ 
  //   this.clientMail.emit('new_mail',user)
  //   //this.clientMail.send({ cmd: 'new_mail' },user)
  //   return 'paso los datos'
  // }

}
