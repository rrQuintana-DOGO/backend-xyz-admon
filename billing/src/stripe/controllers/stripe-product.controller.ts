import { Controller } from '@nestjs/common';
import { StripeProductService } from '@stripe/services/stripe-product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { 
  CreateStripeProductDto,
  UpdateStripeProductDto
} from '@stripe/dto/index';

@Controller('stripe')
export class  StripeProductController {
  constructor(private readonly stripeProductService: StripeProductService) {}

  @MessagePattern({ cmd: 'create-stripe-product' })
  create(@Payload() createStripeProductDto: CreateStripeProductDto) {
    return this.stripeProductService.create(createStripeProductDto);
  }

  @MessagePattern({ cmd: 'find-all-stripe-products' })
  findAll() {
    return this.stripeProductService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-stripe-product' })
  findOne(@Payload('id') id: string) {
    return this.stripeProductService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-stripe-product' })
  update(@Payload() updateStripeProductDto: UpdateStripeProductDto) {
    return this.stripeProductService.update(updateStripeProductDto);
  }

  @MessagePattern({ cmd: 'remove-stripe-product' })
  remove(@Payload('id') id: string) {
    return this.stripeProductService.remove(id);
  }
}
