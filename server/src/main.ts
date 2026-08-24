// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Fix CORS
  app.enableCors({
    origin: '*',
    methods:     ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,                                // needed for cookies
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
    ],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist:            true,
    forbidNonWhitelisted: true,
    transform:            true,
  }));

  await app.listen(process.env.PORT || 4000);
  console.log(`FieldOps API running on port ${process.env.PORT || 4000}`);
}
bootstrap();