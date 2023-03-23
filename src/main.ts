import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './AppModule';
import { HttpExceptionFilter } from './exceptions/ExceptionHttp';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['verbose', 'debug'],
  });

  app.enableCors();
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === 'production',
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('CarX BE API document ')
    .setDescription('CarX API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-document', app, document, {
    swaggerOptions: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
    },
  });
  // if (process.env.NODE_ENV !== 'production') {
  //
  // }

  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') || 1002;
  // app.use(cors());
  await app.listen(port, () => console.log(`Listening on port ${port}`));
}
bootstrap();
