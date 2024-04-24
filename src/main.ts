import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InternalServerErrorFilter } from './filters/internal-server-error.filter';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UnauthorizedExceptionFilter } from './filters/unauthorized-exception.filters';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
config();

const configService = new ConfigService();

const applyFilters = (app: INestApplication<any>) => {
  app.useGlobalFilters(
    new InternalServerErrorFilter(),
    new UnauthorizedExceptionFilter(),
  );
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  applyFilters(app);

  const config = new DocumentBuilder()
    .setTitle('Meta API NestJS')
    .setDescription('Meta Auth API NestJS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configService.get('APP_PORT') || 3000);
}

bootstrap();
