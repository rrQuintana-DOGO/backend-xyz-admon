import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger } from '@nestjs/common';
import { envs } from '@config/index';
import { RpcCustomExceptionFilter } from '@common/index';
import { CustomValidationPipe } from '@common/exceptions/custom-validation-pipe';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: envs.reactAppUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log('Client Gateway is running on port ' + envs.port);
}
bootstrap();
