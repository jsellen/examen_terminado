import { Controller, UseGuards } from '@nestjs/common';
import { CorreosService } from './correos.service';
import { JwtGuardGuard } from '../auth/jwt-guard.guard';

@Controller('correos')
@UseGuards(JwtGuardGuard)
export class CorreosController {
  constructor(private readonly correosService: CorreosService) {}
}
