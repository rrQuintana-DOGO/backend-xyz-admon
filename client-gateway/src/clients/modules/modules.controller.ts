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
import { firstValueFrom } from 'rxjs';
import { CreateModuleDto } from '@clients/modules/dto/create-module.dto';
import { UpdateModuleDto } from '@clients/modules/dto/update-modules.dto';

@Controller('modules')
export class ModulesController {
  private readonly logger = new Logger(ModulesController.name);

  constructor(
    @Inject(NATS_SERVICE) private readonly modulesClient: ClientProxy,
  ) {}

  @Post()
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    try {
      const module = await firstValueFrom(
        this.modulesClient.send({ cmd: 'create-module' }, createModuleDto),
      );

      return module;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  async findAllModules(@Query() paginationDto: PaginationDto) {
    try {
      const modules = await firstValueFrom(
        this.modulesClient.send({ cmd: 'find-all-modules' }, paginationDto),
      );

      return modules;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOneModule(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const client = await firstValueFrom(
        this.modulesClient.send({ cmd: 'find-one-module' }, { id }),
      );

      return client;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get('slug/:slug')
  async findOneModuleBySlug(@Param('slug') slug: string) {
    try {
      const module = await firstValueFrom(
        this.modulesClient.send({ cmd: 'find-one-module-by-slug' }, { slug }),
      );

      return module;
    }
    catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateModule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    try {
      updateModuleDto.id_module = id;
      
      const module = await firstValueFrom(
        this.modulesClient.send({ cmd: 'update-module' }, { id_module: id, ...updateModuleDto }),
      );

      return module;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteModule(@Param('id') id: string) {
    try {
      const module = await firstValueFrom(
        this.modulesClient.send({ cmd: 'remove-module' }, { id }),
      );

      return module;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);      
    }
  }
}
