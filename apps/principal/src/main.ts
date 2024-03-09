import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Examen')
  .setDescription('Esta es para el tarea de Nest.js')
  .setVersion('1.0')
  .addTag('users')
  .addTag('auth')
  .addTag('pedidos')
  .addTag('notificaciones')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3001);
}
bootstrap();
