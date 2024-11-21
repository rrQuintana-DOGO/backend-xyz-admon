import { Module } from '@nestjs/common';
import { 
  StripeProductController,
  StripePriceController
} from '@billing/stripe/controllers/index';
import { NatsModule } from '@app/transports/nats.module';

@Module({
  controllers: [
    StripeProductController,
    StripePriceController,
  ],
  providers: [],
  imports: [NatsModule],
})
export class BillingModule {}
