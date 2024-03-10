import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuardGuard } from './auth/jwt-guard.guard';

/*
  * Esta es la Aplicacion Principal
*/

@UseGuards(JwtGuardGuard)
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
