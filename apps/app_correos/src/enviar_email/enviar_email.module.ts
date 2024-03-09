import { Module } from '@nestjs/common';
import { EnviarEmailService } from './enviar_email.service';
import { EnviarEmailController } from './enviar_email.controller';
import { MailService } from '@sendgrid/mail';

@Module({
  controllers: [EnviarEmailController],
  providers: [EnviarEmailService, MailService],
  exports: [EnviarEmailService],
})
export class EnviarEmailModule {}
