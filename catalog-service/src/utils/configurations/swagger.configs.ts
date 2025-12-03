import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger Configurations
 * @param {INestApplication} app Swagger Config Input for app
 */
export const SetupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Catalog-Service API')
    .setDescription('Catalog Service API Docs')
    // .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'X-API-KEY')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
