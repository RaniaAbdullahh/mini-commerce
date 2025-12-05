import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './utils/configurations/configuration.interface';
import { SetupSwagger } from './utils/configurations/swagger.configs';
import { AllExceptionsFilter } from './utils/filters/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { exposedHeaders: 'x-total-count' },
  });
  const configService = app.get(ConfigService<EnvVariables>);

  SetupSwagger(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(configService.get('PORT'));

  Logger.verbose(
    `Api Documentation http://${configService.get('URL')}${
      (configService.get('ENV') === 'dev' && `:${configService.get('PORT')}`) ||
      ''
    }/api/docs`,
    'NestApplication',
  );
}
bootstrap();
