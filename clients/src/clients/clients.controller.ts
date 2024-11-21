import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from '@clients/clients.service';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { CreateClientDto } from '@clients/dto/create-clients.dto';
import { UpdateClientDto } from '@clients/dto/update-clients.dto';
import { UpdateStripeSubscriptionDto } from '@app/stripe/dto/subscription/update-stripe-subscription-dto';

@Controller('alerts')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @MessagePattern({ cmd: 'create-client' })
  create(@Payload() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @MessagePattern({ cmd: 'update-subscription' }) 
  async updateSubscription(@Payload() updateStripeSubscriptionDto: UpdateStripeSubscriptionDto) {
    return await this.clientsService.updateSubscription(updateStripeSubscriptionDto);
  }

  @MessagePattern({ cmd: 'find-all-clients' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-client' })
  @UUIDGuard('id')
  async findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return await this.clientsService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-token-by-email' })
  async findTokenByEmail(@Payload() data: { email: string }) {
    return await this.clientsService.getTokenByEmail(data);
  }

  @MessagePattern({ cmd: 'generate-portal-session' })
  async generatePortalSession(@Payload() data: { customerId: string }) {
    return await this.clientsService.generateCustomerPortalSession(data);
  }

  @MessagePattern({ cmd: 'end-subscription-free-trial' })
  async endFreeTrial(@Payload() data: { subscriptionId: string }) {
    return await this.clientsService.endFreeTrial(data);
  }

  @MessagePattern({ cmd: 'cancel-subscription' })
  async cancelSubscription(@Payload() data: { subscriptionId: string }) {
    return await this.clientsService.cancelSubscription(data);
  }
  

  @MessagePattern({ cmd: 'update-client' })
  @UUIDGuard('id')
  update(@Payload() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(updateClientDto.id_client, updateClientDto);
  }

  @MessagePattern({ cmd: 'remove-client' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.clientsService.remove(id);
  }
}
