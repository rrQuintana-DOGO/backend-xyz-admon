import { forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { 
  CreateStripePriceDto,
  CreateStripeTearDto,
} from '@stripe/dto/index';
import { Stripe } from 'stripe';
import { StripeProductService } from '@stripe/services/index';
import { envs } from '@app/config';

@Injectable()
export class StripePriceService  {
  
  private readonly logger = new Logger(StripePriceService.name);
  private readonly stripe: Stripe;

  constructor(
    @Inject(forwardRef(() => StripeProductService))
    private readonly stripeProductService: StripeProductService
  ) {
    this.stripe = new Stripe(envs.stripeSecretKey);
  }

  async findPricesByProduct(productId: string){
    return this.stripe.prices.list({product: productId, expand: ['data.tiers']});
  }

  transformData(prices: Stripe.Price[]) {
    return prices.map(price => ({
      id: price.id,
      active: price.active,
      billing_scheme: price.billing_scheme,
      currency: price.currency,
      product: price.product,
      recurring: price.recurring ? {
        interval: price.recurring.interval,
        interval_count: price.recurring.interval_count,
        usage_type: price.recurring.usage_type,
      } : null,
      tiers_mode: price.tiers_mode,
      type: price.type,
      tiers: price.tiers ? price.tiers.
      map(tier => ({
        unit_amount: tier.unit_amount / 100,
        up_to: tier.up_to || 'inf',
      })) : null,
    }));
  }
  
  async create(createStripePriceDto: CreateStripePriceDto) {

    await this.stripeProductService.findOne(createStripePriceDto.product);

    try{ 
      const { tiers, ...rest } = createStripePriceDto;

      const newTiers = tiers.map((tier: CreateStripeTearDto) => {
        return {
          ...tier,
          unit_amount:  typeof tier.unit_amount === 'number' ? tier.unit_amount * 100 : tier.unit_amount,
        };
      }
      );

      return await this.stripe.prices.create({...rest, tiers: newTiers});
      
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error al crear el precio`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(){
    try{
      const prices = (await this.stripe.prices.list({expand : ['data.tiers']})).data;
      return this.transformData(prices);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error al obtener los precios`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: string){
    try{
      const price = await this.stripe.prices.retrieve(id, {expand : ['tiers']});
      return this.transformData([price])[0];
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `No se encontro el precio con id ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string){
    await this.findOne(id);
    try{
      return await  this.stripe.prices.update(id, {active: false});
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error desactivar el precio`,
        status : HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
