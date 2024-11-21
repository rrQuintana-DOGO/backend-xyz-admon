import { Controller } from '@nestjs/common';
import { StripePriceService } from '@stripe/services/stripe-price.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { 
  CreateStripePriceDto,
} from '@stripe/dto/index';

@Controller('stripe')
export class  StripePriceController {
  constructor(private readonly stripePriceService: StripePriceService) {}

  @MessagePattern({ cmd: 'create-stripe-price' })
  create(@Payload() createStripePriceDto: CreateStripePriceDto) {
    return this.stripePriceService.create(createStripePriceDto);
  }

  @MessagePattern({ cmd: 'find-all-stripe-prices' })
  findAll() {
    return this.stripePriceService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-stripe-price' })
  findOne(@Payload('id') id: string) {
    return this.stripePriceService.findOne(id);
  }

  @MessagePattern({ cmd: 'remove-stripe-price' })
  remove(@Payload('id') id: string) {
    return this.stripePriceService.remove(id);
  }

}
