import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

/*
  * Esta es la Aplicacion Principal
*/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

// @Post()
// newUser(@Body() body:any): string {
//   return this.appService.newUser(body)
// }

/* @Post('variables_env')
variables_env() {
  for (const key in process.env) {
    console.log(key)
  }
} */

}
