import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import Stripe from 'stripe';
import { envs } from '@app/config';
import { CreateStripeSubscriptionDto } from '../dto/subscription/create-stripe-subscription.dto';
import { UpdateStripeSubscriptionDto } from '../dto';

@Injectable()
export class StripeSubscriptionService {

  private readonly logger = new Logger(StripeSubscriptionService.name);
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(envs.stripeSecretKey);
  }

  async create(createStripeSubscriptionDto: CreateStripeSubscriptionDto) {
    try {
      const {
        temperature_module,
        fuel_module, maintenance_module,
        units,
        payment_method_type,
        ...rest } = createStripeSubscriptionDto;

      const items = [
        {
          price: envs.tripsModuleId,
          quantity: units
        },
        {
          price: envs.alertsModuleId,
          quantity: units
        },
        {
          price: envs.unitsModuleId,
          quantity: units
        },
      ]

      if (temperature_module) {
        items.push({
          price: envs.temperaturesModuleId,
          quantity: units
        });

        if (fuel_module) {
          items.push({
            price: envs.fuelsModuleId,
            quantity: units
          });
        }

        if (maintenance_module) {
          items.push({
            price: envs.maintenancesModuleId,
            quantity: units
          });
        }
      }

      const subs_data = await this.stripe.subscriptions.create({
        ...rest,
        items,
        default_tax_rates: [envs.taxRateId],
        payment_settings: {
          payment_method_types: [payment_method_type],

        },
        proration_behavior: 'create_prorations',
      });

      return {
        message: 'Suscripción creada con éxito',
        data: subs_data,
        status: HttpStatus.CREATED
      }
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al crear la suscripción: ${error}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async endFreeTrial(data: { subscriptionId: string }) {
    const { subscriptionId } = data;
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        trial_end: 'now',
      });
      return {
        message: 'Se ha cancelado la prueba gratuita con éxito',
        status: HttpStatus.OK
      }
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al finalizar la prueba gratuita}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async cancelSubscription(data: { subscriptionId: string }) {
    const { subscriptionId } = data;
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return {
        message: 'Se ha cancelado la suscripción con éxito',
        status: HttpStatus.OK
      }
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al cancelar la suscripción}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(id);
      const prices = subscription.items.data;

      const products = await Promise.all(
        prices.map(async (price) => {
          const product = await this.stripe.products.retrieve(price.price.product.toString());
          return product;
        })
      );

      return {
        subscription,
        products,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `No se encontró la suscripción con id ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  async updateSubscription(data: UpdateStripeSubscriptionDto) {
    const { subscriptionId, maintenance_module, fuel_module, temperature_module, units, clientId, payment_method_type, ...rest } = data;

    const newItems = [
      {
        price: envs.tripsModuleId,
        quantity: units
      },
      {
        price: envs.alertsModuleId,
        quantity: units
      },
      {
        price: envs.unitsModuleId,
        quantity: units
      },
    ];

    if (temperature_module) {
      newItems.push({
        price: envs.temperaturesModuleId,
        quantity: units
      });
    }

    if (fuel_module) {
      newItems.push({
        price: envs.fuelsModuleId,
        quantity: units
      });
    }

    if (maintenance_module) {
      newItems.push({
        price: envs.maintenancesModuleId,
        quantity: units
      });
    }

    try {
      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        ...rest,
        default_tax_rates: [envs.taxRateId],
        proration_behavior: 'create_prorations',
        payment_settings: {
          payment_method_types: [payment_method_type],
        },
      });

      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      const currentItems = subscription.items.data;

      const newItemsMap = new Map(newItems.map(item => [item.price, item]));

      for (const currentItem of currentItems) {
        const newItem = newItemsMap.get(currentItem.price.id);
        if (newItem) {
          if (currentItem.quantity !== newItem.quantity) {
            await this.stripe.subscriptionItems.update(currentItem.id, {
              quantity: newItem.quantity,
            });
          }
          newItemsMap.delete(currentItem.price.id);
        } else {
          await this.stripe.subscriptionItems.del(currentItem.id);
        }
      }

      for (const newItem of newItemsMap.values()) {
        await this.stripe.subscriptionItems.create({
          subscription: subscriptionId,
          price: newItem.price,
          quantity: newItem.quantity,
        });
      }

      return {
        message: 'Suscripción actualizada con éxito',
        data: updatedSubscription,
        status: HttpStatus.OK
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrió un error al actualizar la suscripción: ${error}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findMultiple(ids: string[]) {
    try {
      const subscriptions = await Promise.all(
        ids.map(async (id) => {
          const subscription = await this.stripe.subscriptions.retrieve(id);
          const prices = subscription.items.data;

          const products = await Promise.all(
            prices.map(async (price) => {
              const product = await this.stripe.products.retrieve(price.price.product.toString());
              return {
                ...product,
                quantity: price.quantity,
              }
            })
          );

          const latestInvoice = await this.stripe.invoices.retrieve(String(subscription.latest_invoice));

          const invoices = await this.stripe.invoices.list({
            subscription: id,
            status: 'paid',
          });
  
          const totalSpent = invoices.data.reduce((total, invoice) => total + invoice.amount_paid, 0);

          return {
            subscription,
            products,
            latest_payment_status: latestInvoice.status,
            total_spent: totalSpent
          };
        })
      );

      return subscriptions;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Error retrieving subscriptions`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
