import { Module } from '@nestjs/common';
import { ClientsService } from '@clients/clients.service';
import { ClientsController } from '@clients/clients.controller';
import { NatsModule } from '@app/transports/nats.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    NatsModule,
    JwtModule.register({
      secret: envs.secret_key_token,
      //signOptions: { expiresIn: '1h' },
    }),
    HttpModule
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})

export class ClientsModule {}
