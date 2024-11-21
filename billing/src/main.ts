import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from '@config/index';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomValidationPipe } from '@common/exceptions/custom-validation-pipe';

async function bootstrap() {
  const logger = new Logger('Main-Billing');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      },
    },
  );

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
  logger.log(`Billing microservice running`);
}
bootstrap();
