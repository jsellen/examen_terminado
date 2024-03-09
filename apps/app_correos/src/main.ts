import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppCorreosModule } from './app_correos.module';
/**
 * Esta es nuesta APP-Correos
 */
async function bootstrap() {
  // const app = await NestFactory.create(AppCorreosModule);
  // await app.listen(3000);

  /**
   * Esto es el microsrevicio de EMAIL
   */
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppCorreosModule, 
    {
    transport: Transport.TCP,
    }
  );
  
  await app.listen();
}
bootstrap();