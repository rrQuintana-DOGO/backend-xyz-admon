import { forwardRef, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { 
  CreateStripeProductDto,
  UpdateStripeProductDto
} from '@stripe/dto/index';
import Stripe from 'stripe';
import { StripePriceService } from '@stripe/services/index';
import { envs } from '@app/config';

@Injectable()
export class StripeProductService  {
  
  private readonly logger = new Logger(StripeProductService.name);
  private readonly stripe: Stripe;

  constructor(
    @Inject(forwardRef(() => StripePriceService))
    private readonly stripePriceService: StripePriceService
  ) {
    this.stripe = new Stripe(envs.stripeSecretKey);
  }

  async create(createStripeProductDto: CreateStripeProductDto) {
    try{
      return this.stripe.products.create({...createStripeProductDto});
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error al crear el producto: ${error}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  transformData(product: Stripe.Product, prices: Stripe.Price[] = []){
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      images: product.images,
      prices: prices.map(price => ({
        id: price.id,
        active : price.active,
        billing_scheme: price.billing_scheme,
        currency: price.currency,
        product: price.product,
        recurring : {
          interval: price.recurring?.interval,
          interval_count: price.recurring?.interval_count,
          usage_type: price.recurring?.usage_type,
        },
        tiers_mode: price.tiers_mode,
        type: price.type,
        tiers : price.tiers?.map(tier => ({
          unit_amount: tier.unit_amount / 100,
          up_to: tier.up_to  || 'inf',
        })),
      })),
    }
  }

  async findAll(){
    try{
      const products = (await this.stripe.products.list()).data;
      
      const productsWithPrices = await Promise.all(products.map(async product => {
        const prices = await this.stripePriceService.findPricesByProduct(product.id);
        return this.transformData(product, prices.data);
      }
      ));

      return productsWithPrices; 
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error al obtener los productos`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: string){
    try{
      const product = await this.stripe.products.retrieve(id);
      const prices = await this.stripePriceService.findPricesByProduct(id);

      return this.transformData(product, prices.data);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `No se encontro el producto con id ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  async update(updateStripeProductDto: UpdateStripeProductDto){
    await this.findOne(updateStripeProductDto.id);
    try{
      const {id, ...details} = updateStripeProductDto;
      return await this.stripe.products.update(id, details);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error al actualizar el producto`,
        status : HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string){
    await this.findOne(id);
    try{
      return await this.stripe.products.del(id);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message : `Ocurrio un error al eliminar el producto`,
        status : HttpStatus.BAD_REQUEST,
      });
    }
  }
  
}
