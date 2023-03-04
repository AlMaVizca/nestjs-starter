import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Config } from './config/config.const';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Server } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);

  if (configService.get(Config.LOAD_SWAGGER_UI)) {
    loadSwaggerUI(app, process.env.npm_package_name);
  }

  const server = await app.listen(process.env.PORT || 3000);
  setupGracefullyStop(server);
}

function loadSwaggerUI(app: INestApplication, title: string) {
  const version = process.env.npm_package_version;
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(`Routes for ${title} API`)
    .setVersion(version)
    .addTag('service')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'authorization' },
      'auth-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  Logger.debug('DEBUG: Swagger UI loaded');
}

function setupGracefullyStop(server: Server) {
  function setupSignalHandler(signal: string) {
    process.on(signal, () => {
      console.warn(`${signal} received, stopping server`);
      server.close();
    });
  }

  setupSignalHandler('SIGTERM');
  setupSignalHandler('SIGINT');

  server.on('close', () => {
    console.log('Server stopped.');
    process.exit(0);
  });
}
bootstrap();
