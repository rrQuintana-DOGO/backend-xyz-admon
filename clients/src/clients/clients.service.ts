import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PaginationDto } from '@common/index';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { envs, NATS_SERVICE } from '@app/config';
import { CreateClientDto } from '@clients/dto/create-clients.dto';
import { UpdateClientDto } from '@clients/dto/update-clients.dto';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { firstValueFrom } from 'rxjs';
import { CreateStripeSubscriptionDto } from '@app/stripe/dto/subscription/create-stripe-subscription.dto';
import { StripeSubscriptionCustom } from '@stripe/entities/stripe-subscription-custom.entity';
import { UpdateStripeSubscriptionDto } from '@app/stripe/dto/subscription/update-stripe-subscription-dto';
import { JwtService } from '@nestjs/jwt';
import { CompactEncrypt } from 'jose';
import { createHash } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { use } from 'passport';

@Injectable()
export class ClientsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ClientsService.name);
  private readonly secret_key = createHash('sha256')
    .update(envs.crypt_key)
    .digest();
  private readonly clientGatewayUrl = envs.xyz_client_gateway_url;

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Client Service Connected to the database');
    } catch (error) {
      this.logger.error('Error connecting to the database', error);
      throw new RpcException({
        message: 'Error connecting to the database',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async verifyClientExists(rfc: string) {
    const clients = await this.clients.findMany({
      where: { rfc: rfc },
    });

    if (clients.length > 0) {
      throw new RpcException({
        message: `El RFC ${rfc} ya existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async generateToken(client: any) {
    const payload = {
      id_client: client.id_client,
      slug: client.slug,
    };

    const payloadBuffer = new TextEncoder().encode(JSON.stringify(payload));

    const payloadEncrypted = await new CompactEncrypt(payloadBuffer)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .encrypt(this.secret_key);

    return {
      access_token: this.jwtService.sign({ data: payloadEncrypted }),
    };
  }

  async create(createClientDto: CreateClientDto) {
    const {
      company_name,
      collection_method,
      units,
      temperature_module,
      fuel_module,
      maintenance_module,
      trial_period_days,
      days_until_due,
      payment_method_type,
      ...rest
    } = createClientDto;

    let notifications_module, travel_planning_module, users_module, units_module;
    let client, createCustomerStripe;

    try {
      notifications_module = await firstValueFrom(
        this.client.send(
          { cmd: 'find-one-module-by-slug' },
          { slug: 'notifications' },
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      travel_planning_module = await firstValueFrom(
        this.client.send(
          { cmd: 'find-one-module-by-slug' },
          { slug: 'travel_planning' },
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      users_module = await firstValueFrom(
        this.client.send(
          { cmd: 'find-one-module-by-slug' },
          { slug: 'users' },
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      units_module = await firstValueFrom(
        this.client.send(
          { cmd: 'find-one-module-by-slug' },
          { slug: 'units' },
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await this.verifyClientExists(createClientDto.rfc);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      await firstValueFrom(
        this.client.send(
          { cmd: 'validate-stripe-customer' },
          { email: createClientDto.email },
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      createCustomerStripe = await firstValueFrom(
        this.client.send(
          { cmd: 'create-stripe-customer' },
          {
            name: createClientDto.name,
            email: createClientDto.email,
          },
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const client_slug = company_name.replace(/\s+/g, '_').toLowerCase();

    try {
      client = await this.clients.create({
        data: {
          ...rest,
          id_ext: '1234',
          status: true,
          company_name: company_name,
          slug: client_slug,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message ||
          `El cliente con RFC ${createClientDto.rfc} no pudo ser creado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const token = await this.generateToken(client);

    try {
      const db_notifications = await this.sendToGateway({
        url: '/db-notifications-manager',
        token: token.access_token,
      });

      await this.client_databases.create({
        data: {
          id_client: client.id_client,
          id_module: notifications_module.id_module,
          database_token: client.slug,
          status: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const db_travel_planning = await this.sendToGateway({
        url: '/db-travel-planning-manager',
        token: token.access_token,
      });

      await this.client_databases.create({
        data: {
          id_client: client.id_client,
          id_module: travel_planning_module.id_module,
          database_token: client.slug,
          status: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const db_users = await this.sendToGateway({
        url: '/db-users-manager',
        token: token.access_token,
      });

      await this.client_databases.create({
        data: {
          id_client: client.id_client,
          id_module: users_module.id_module,
          database_token: client.slug,
          status: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const db_units = await this.sendToGateway({
        url: '/db-units-manager',
        token: token.access_token,
      });

      await this.client_databases.create({
        data: {
          id_client: client.id_client,
          id_module: units_module.id_module,
          database_token: client.slug,
          status: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    try {
      const subscriptionData: CreateStripeSubscriptionDto = {
        customer: createCustomerStripe.id,
        collection_method,
        units,
        trial_period_days: 100,
        temperature_module,
        fuel_module,
        maintenance_module,
        payment_method_type,
      };

      if (collection_method === 'send_invoice') {
        subscriptionData.days_until_due = 30;
      }

      const subscription = await firstValueFrom(
        this.client.send(
          { cmd: 'create-stripe-subscription' },
          subscriptionData,
        ),
      );

      await this.subscriptions.create({
        data: {
          id_client: client.id_client,
          status: true,
          id_subscription_stripe: subscription.data.id,
        },
      });

      return {
        client,
        token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message:
          error.message ||
          `El cliente con RFC ${createClientDto.rfc} no pudo ser creado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const totalPages = await this.clients.count({ where: { status: true } });
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const clients = await this.clients.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
        include: {
          subscriptions: {
            select: {
              id_subscription_stripe: true,
            },
          },
        },
      });

      const ids_subscriptions = clients.map(
        (client) => client.subscriptions[0].id_subscription_stripe,
      );
      let subscriptions: StripeSubscriptionCustom[] = [];

      try {
        subscriptions = await firstValueFrom(
          this.client.send(
            { cmd: 'find-multiple-subscriptions' },
            { ids: ids_subscriptions },
          ),
        );
      } catch (error) {
        throw new RpcException({
          message:
            error.message ||
            `No se encontraron las suscripciones de los clientes`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      const data = clients.map((client) => {
        return this.transformData(
          client,
          subscriptions.find(
            (subscription) =>
              subscription.subscription.id ===
              client.subscriptions[0].id_subscription_stripe,
          ),
        );
      });

      return {
        data,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message || 'Error al obtener los clientes',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getTokenByEmail(data: {
    email: string;
  }): Promise<{ token?: string; message: string }> {
    const { email } = data;

    try {
      const client = await this.clients.findFirst({
        where: { email },
        select: { id_client: true, email: true, slug: true },
      });

      if (!client) {
        throw new RpcException({
          message: `No se encontró un cliente con el correo ${email}`,
          status: HttpStatus.NOT_FOUND,
        });
      }

      const token = await this.generateToken(client);

      return {
        token: token.access_token,
        message: 'Token generado con éxito.',
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message || 'Error al verificar el correo.',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  transformData(
    client: CreateClientDto,
    subscription: StripeSubscriptionCustom,
  ) {
    return {
      id_client: client.id_client,
      id_stripe_customer: client.id_ext,
      name: client.name,
      email: client.email,
      rfc: client.rfc,
      address: client.address,
      status: client.status,
      company_name: client.company_name,
      subscription: {
        id_stripe_subscription: subscription.subscription.id,
        status: subscription.subscription.status,
        current_period_end: subscription.subscription.current_period_end,
        current_period_start: subscription.subscription.current_period_start,
        trial_start: subscription.subscription.trial_start,
        trial_end: subscription.subscription.trial_end,
        created: subscription.subscription.created,
        collection_method: subscription.subscription.collection_method,
        days_until_due: subscription.subscription.days_until_due,
        units: subscription.products[0].quantity,
        items: subscription.products.map(item => {
          return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
          }
        }),
        latest_payment_status: subscription.latest_payment_status,
        total_spent: subscription.total_spent,
        payment_method_type: subscription.subscription.payment_settings.payment_method_types[0],
        default_payment_method: subscription.subscription.default_payment_method,
        latest_invoice: subscription.subscription.latest_invoice,
        start_date: subscription.subscription.start_date,
      },
    };
  }

  async findOne(id: string, status = true) {
    const client = await this.clients.findUnique({
      where: { id_client: id, status },
      include: {
        subscriptions: {
          select: {
            id_subscription_stripe: true,
          },
        },
      },
    });

    if (!client) {
      throw new RpcException({
        message: `El cliente con id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    const { subscriptions, ...rest } = client;

    let subscription: StripeSubscriptionCustom;

    try {
      subscription = await firstValueFrom(
        this.client.send(
          { cmd: 'find-one-stripe-subscription' },
          { id: subscriptions[0].id_subscription_stripe },
        ),
      );
    } catch (error) {
      throw new RpcException({
        message:
          error.message ||
          `No se encontro la suscripción del cliente con id ${id}`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return this.transformData(rest, subscription);
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    await this.findOne(id);

    const {
      collection_method,
      units,
      temperature_module,
      fuel_module,
      maintenance_module,
      trial_period_days,
      days_until_due,
      payment_method_type,
      name,
      email,
      ...rest
    } = updateClientDto;

    try {
      await this.clients.update({
        where: { id_client: id },
        data: rest,
      });

      return this.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `El cliente con id ${id} no pudo ser actualizado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string) {
    const customer = await this.findOne(id);

    try {
      const subscription = await this.subscriptions.findFirst({
        where: { id_client: id },
      });

      await this.subscriptions.update({
        where: { id_subscription: subscription.id_subscription },
        data: { status: false },
      });

      await this.cancelSubscription({
        subscriptionId: customer.subscription.id_stripe_subscription,
      });

      await this.client_databases.updateMany({
        where: { id_client: id },
        data: { status: false },
      });

      return this.clients.update({
        where: { id_client: id },
        data: { status: false },
      });
    } catch (error) {
      const message =
        error.message || `El cliente con id ${id} no pudo ser eliminado`;
      throw new RpcException({
        message: message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async generateCustomerPortalSession(data: { customerId: string }) {
    try {
      const session = await firstValueFrom(
        this.client.send(
          { cmd: 'generate-stripe-customer-portal-session' },
          data,
        ),
      );

      return {
        url: session.url,
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al generar la sesión del portal del cliente`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async endFreeTrial(data: { subscriptionId: string }) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'stripe-subscription-end-free-trial' }, data),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al finalizar el periodo de prueba`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async cancelSubscription(data: { subscriptionId: string }) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'stripe-subscription-cancel' }, data),
      );
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al cancelar la suscripción`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async updateSubscription(data: UpdateStripeSubscriptionDto) {
    try {
      await firstValueFrom(
        this.client.send({ cmd: 'stripe-update-subscription' }, data),
      );
      return this.findOne(data.clientId);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `Ocurrio un error al actualizar la suscripción`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  private async sendToGateway({
    url,
    payload,
    token,
  }: {
    url: string;
    payload?: any;
    token: string;
  }) {
    const fullUrl = `${this.clientGatewayUrl}${url}`;

    this.logger.log(`URL: ${fullUrl}`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);
    this.logger.log(`Token: ${token}`);

    try {
      const response = await lastValueFrom(
        this.httpService.post(fullUrl, payload || {}, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error al realizar solicitud al gateway: ${error.message}`,
      );

      // Manejo de errores mejorado
      if (error.response) {
        this.logger.error(
          `Error en la respuesta del gateway: ${error.response.data}`,
        );
        throw new RpcException({
          message: `Error en la respuesta del gateway: ${error.response.data}`,
          status: HttpStatus.BAD_REQUEST,
        });
      } else if (error.request) {
        this.logger.error(
          `No se recibió respuesta del gateway: ${error.request}`,
        );
        throw new RpcException({
          message: 'No se recibió respuesta del gateway',
          status: HttpStatus.GATEWAY_TIMEOUT,
        });
      } else {
        this.logger.error(
          `Error en la configuración de la solicitud: ${error.message}`,
        );
        throw new RpcException({
          message: `Error en la configuración de la solicitud: ${error.message}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
