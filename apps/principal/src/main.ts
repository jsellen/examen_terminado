import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3001;

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Examen')
  .setDescription('Esta es para el tarea de Nest.js')
  .setVersion('2.0')
  .addTag('users')
  .addTag('auth')
  .addTag('pedidos')
  .addTag('notificaciones')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.useGlobalPipes(
    new ValidationPipe(
      {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }
    )
  );
  await app.listen(PORT);
}
bootstrap();
