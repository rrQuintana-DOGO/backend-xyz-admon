import {
    Body,
    Controller,
    Inject,
    Post,
    HttpStatus,
    Get,
    Param,
    Delete,
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { NATS_SERVICE } from 'src/config';
  import { 
    CreateStripePriceDto,
    UpdateStripePriceDto
  } from '@billing/stripe/dto/index';
  
  @Controller('stripe')
  export class StripePriceController {
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsStripe: ClientProxy,
    ) {}
    
    @Post('prices')
    async createStripePrice(@Body() createStripePriceDto: CreateStripePriceDto) {
      try {
        const price = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'create-stripe-price' }, createStripePriceDto),
        );
  
        return price;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Get('prices')
    async findAllStripePrices() {
      try {
        const price = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'find-all-stripe-prices' }, {}),
        );
  
        return price;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Get('prices/:id')
    async findOneStripeProduct(@Param('id') id: string) {
      try {
        const price = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'find-one-stripe-price' },  { id }),
        );
  
        return price;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Delete('prices/:id')
    async deleteStripePrice(@Param('id') id: string){
      try {
        const product = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'remove-stripe-price' }, { id }),
        );
  
        return product;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }
}
