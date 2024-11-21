import { Module } from '@nestjs/common';
import { 
  StripeProductService,
  StripePriceService,
  StripeCustomerService,
  StripeSubscriptionService,
} from '@stripe/services/index';
import { 
  StripeProductController, 
  StripePriceController, 
  StripeSubscriptionController,
  StripeCustomerController
} from '@app/stripe/controllers/index';
@Module({
  controllers: [
    StripeProductController,
    StripePriceController,
    StripeSubscriptionController,
    StripeCustomerController
  ],
  providers: [
    StripeProductService,
    StripePriceService,
    StripeCustomerService,
    StripeSubscriptionService
  ],
  exports: [
    StripeProductService,
    StripePriceService,
    StripeCustomerService
  ]
})
export class StripeModule {}
