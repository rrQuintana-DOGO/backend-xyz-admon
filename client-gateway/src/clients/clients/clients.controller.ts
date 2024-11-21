import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
  Delete,
  Logger,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '@common/index';
import { NATS_SERVICE } from '@config/index';
import { CreateClientDto } from '@clients/clients/dto/create-clients.dto';
import { UpdateClientDto } from '@clients/clients/dto/update-clients.dto';
import { firstValueFrom } from 'rxjs';
import Stripe from 'stripe';
import { UpdateStripeSubscriptionDto } from '@app/billing/stripe/dto';

@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly clientsClient: ClientProxy,
  ) {}

  @Post()
  async createClient(@Body() createClientDto: CreateClientDto) {
    try {
      const client = await firstValueFrom(
        this.clientsClient.send({ cmd: 'create-client' }, createClientDto),
      );

      return client;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAllClients(@Query() paginationDto: PaginationDto) {
    try {
      const clients = await firstValueFrom(
        this.clientsClient.send({ cmd: 'find-all-clients' }, paginationDto),
      );

      return clients;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOneClient(@Param('id') id: string) {
    try {
      const client = await firstValueFrom(
        this.clientsClient.send({ cmd: 'find-one-client' }, { id }),
      );

      return client;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get('/email/find')
  async findTokenByEmail(@Body() data: { email: string }) {
    try {
      const client = await firstValueFrom(
        this.clientsClient.send({ cmd: 'find-token-by-email' }, data),
      );

      return client;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Post('/generate-portal-session')
  async generatePortalSession(@Body() data: { customerId: string }) {
    try {
      const session = await firstValueFrom(
        this.clientsClient.send({ cmd: 'generate-portal-session' }, data),
      );
  
      return session;
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/end-free-trial')
  async endFreeTrial(@Body() data: { subscriptionId: string }) {
    try {
      const session = await firstValueFrom(
        this.clientsClient.send({ cmd: 'end-subscription-free-trial' }, data),
      );
  
      return session;
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/cancel-subscription')
  async cancelSubscription(@Body() data: { subscriptionId: string }) {
    try {
      const session = await firstValueFrom(
        this.clientsClient.send({ cmd: 'cancel-subscription' }, data),
      );
  
      return session;
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('/update-subscription')
  async updateSubscription(@Body() data: UpdateStripeSubscriptionDto) {
    try {
      const session = await firstValueFrom(
        this.clientsClient.send({ cmd: 'update-subscription' }, data),
      );
  
      return session;
    }
    catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    try {
      updateClientDto.id_client = id;
      
      const alert = await firstValueFrom(
        this.clientsClient.send({ cmd: 'update-client' }, { id_client: id, ...updateClientDto }),
      );
      return alert;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteClient(@Param('id') id: string) {
    try {
      const client = await firstValueFrom(
        this.clientsClient.send({ cmd: 'remove-client' }, { id }),
      );

      return client;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      
    }
  }
}
