import { Controller } from '@nestjs/common';
import { StripeCustomerService } from '@stripe/services/stripe-customer.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateStripeCustomerDto } from '@stripe/dto/customer/create-customer.dto';

@Controller('stripe')
export class StripeCustomerController {
  constructor(private readonly stripeCustomerService: StripeCustomerService) { }

  @MessagePattern({ cmd: 'create-stripe-customer' })
  create(@Payload() createStriperCustomer: CreateStripeCustomerDto ) {
    return this.stripeCustomerService.create(createStriperCustomer);
  }

  @MessagePattern({ cmd: 'find-one-stripe-customer' })
  findOne(@Payload('id') id: string) {
    return this.stripeCustomerService.findOne(id);
  }

  @MessagePattern({ cmd: 'validate-stripe-customer' })
  validateCustomer(@Payload('email') email: string) {
    return this.stripeCustomerService.validateCustomer(email);
  }

  @MessagePattern({cmd:'generate-stripe-customer-portal-session'})
  generateStripeCustomerPortalSession(@Payload() data: {customerId: string}) {
    return this.stripeCustomerService.generateCustomerPortalSession(data)
  }

}
