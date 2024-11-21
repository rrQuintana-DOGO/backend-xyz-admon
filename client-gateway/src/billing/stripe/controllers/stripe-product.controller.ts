import {
    Body,
    Controller,
    Inject,
    Post,
    Get,
    Delete,
    Param
  } from '@nestjs/common';
  import { ClientProxy, RpcException } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { NATS_SERVICE } from 'src/config';
  import { 
    CreateStripeProductDto,
    UpdateStripeProductDto
  } from '@billing/stripe/dto/index';
  
  @Controller('stripe')
  export class StripeProductController {
    constructor(
      @Inject(NATS_SERVICE) private readonly clientsStripe: ClientProxy,
    ) {}
    
    @Post('products')
    async createStripeProduct(@Body() createStripeProductDto: CreateStripeProductDto) {
      try {
        const product = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'create-stripe-product' }, createStripeProductDto),
        );
  
        return product;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Get('products')
    async findAllStripeProducts() {
      try {
        const product = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'find-all-stripe-products' }, {}),
        );
  
        return product;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Get('products/:id')
    async findOneStripeProduct(@Param('id') id: string) {
      try {
        const product = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'find-one-stripe-product' },  { id }),
        );
  
        return product;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Delete('products/:id')
    async deleteStripeProduct(@Param('id') id: string){
      try {
        const product = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'remove-stripe-product' }, { id }),
        );
  
        return product;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
    }

    @Post('products/:id')
    async updateStripeProduct(
      @Param('id') id: string,
      @Body() updateStripeProductDto: UpdateStripeProductDto
    ) {
      try {
        const product = await firstValueFrom(
          this.clientsStripe.send({ cmd: 'update-stripe-product' }, {id, ...updateStripeProductDto}),
        );
  
        return product;
      } catch (error) {
        console.log('error', error);
        throw new RpcException(error);  }
      }

}
