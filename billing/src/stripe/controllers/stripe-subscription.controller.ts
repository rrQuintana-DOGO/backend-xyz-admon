import { Controller } from '@nestjs/common';
import { StripeSubscriptionService } from '@stripe/services/stripe-subscription.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateStripeSubscriptionDto,
  UpdateStripeSubscriptionDto
} from '@stripe/dto/index';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeSubscriptionController {
  constructor(private readonly stripeSubscriptionService: StripeSubscriptionService) { }

  @MessagePattern({ cmd: 'create-stripe-subscription' })
  create(@Payload() createStripeSubscriptionDto: CreateStripeSubscriptionDto) {
    return this.stripeSubscriptionService.create(createStripeSubscriptionDto);
  }

  @MessagePattern({cmd :'stripe-subscription-end-free-trial' })
  endStripeFreeTrial(@Payload() data: {subscriptionId: string}) {
    return this.stripeSubscriptionService.endFreeTrial(data)
  }

  @MessagePattern({cmd: 'stripe-subscription-cancel'})
  cancelStripeSubscription(@Payload() data: {subscriptionId: string}) {
    return this.stripeSubscriptionService.cancelSubscription(data)
  }

  @MessagePattern({ cmd: 'stripe-update-subscription' })
  updateSubscription(@Payload() data: UpdateStripeSubscriptionDto) {
    return this.stripeSubscriptionService.updateSubscription(data)
  }


  @MessagePattern({ cmd: 'find-one-stripe-subscription' })
  findOne(@Payload('id') id: string) {
    return this.stripeSubscriptionService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-multiple-subscriptions' })
  findMultiple(@Payload('ids') ids: string[]) {
    return this.stripeSubscriptionService.findMultiple(ids);
  }
}
