import { ClientsController } from '@clients/clients/clients.controller';
import { Module } from '@nestjs/common';
import { NatsModule } from '@app/transports/nats.module';
import { ModulesController } from '@clients/modules/modules.controller';

@Module({
  controllers: [
    ClientsController,
    ModulesController,
  ],
  providers: [],
  imports: [NatsModule],
})

export class ClientsModule {}
