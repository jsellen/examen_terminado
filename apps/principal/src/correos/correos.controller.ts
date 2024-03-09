import { Controller } from '@nestjs/common';
import { CorreosService } from './correos.service';

@Controller('correos')
export class CorreosController {
  constructor(private readonly correosService: CorreosService) {}
}
