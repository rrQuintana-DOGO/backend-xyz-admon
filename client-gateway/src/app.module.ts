import { Module } from '@nestjs/common';
import { ClientsModule } from '@clients/clients.module';
import { NatsModule } from '@transports/nats.module';
import { BillingModule } from '@billing/stripe/billing.module';
@Module({
  imports: [
    ClientsModule,
    NatsModule,
    BillingModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
