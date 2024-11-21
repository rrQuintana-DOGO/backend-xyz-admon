import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Stripe } from 'stripe';
import { CreateStripeCustomerDto } from '../dto/customer/create-customer.dto';
import { envs } from '@app/config';

@Injectable()
export class StripeCustomerService {

  private readonly logger = new Logger(StripeCustomerService.name);
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(envs.stripeSecretKey);
  }


  async create(createStripeCustomerDto: CreateStripeCustomerDto) {
    try {
      const customer = await this.stripe.customers.create(createStripeCustomerDto);
      return customer;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al crear el cliente en stripe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: string) {
    try {
      const customer = await this.stripe.customers.retrieve(id);
      if (!customer) {
        throw new RpcException({
          message: `El cliente con id ${id} no existe en stripe`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
      return customer;
    } catch (error) {
      this.logger.error(error);
      const message = error.message || `No se encontro al cliente con id ${id} en stripe`;
      throw new RpcException({
        message: message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateCustomer(email: string) {

    const customer = await this.stripe.customers.search({ query: `email:\'${email}\'` });

    if (customer.data.length) {
      throw new RpcException({
        message: `El cliente con el correo ${email} ya existe en stripe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return true;
  }

  async generateCustomerPortalSession(data: { customerId: string }) {
    console.log(data);
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: data.customerId,
        return_url: envs.stripePortalReturnUrl,
      });
      return session;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al crear la sesión del portal del cliente`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

}
