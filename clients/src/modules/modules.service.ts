import {
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PaginationDto } from '@common/index';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { validatePageAndLimit } from '@common/exceptions/validatePages';
import { CreateModuleDto } from '@modules/dto/create-module.dto';
import { UpdateModuleDto } from '@modules/dto/update-modules.dto';

@Injectable()
export class ModulesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ModulesService.name);

  constructor() {
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

  async create(createModuleDto: CreateModuleDto) {
    try {
      return await this.modules.create({
        data: createModuleDto,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message:
          error.message ||
          `El modulo ${createModuleDto.name} no pudo ser creado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const totalPages = await this.modules.count({ where: { status: true } });
      const lastPage = Math.ceil(totalPages / limit);

      validatePageAndLimit(page, lastPage);

      const clients = await this.modules.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: true },
      });

      return {
        clients,
        meta: {
          total_records: totalPages,
          current_page: page,
          total_pages: lastPage,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: error.message || 'Error al obtener los modulos',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: string, status = true) {
    const module = await this.modules.findUnique({
      where: { id_module: id, status },
    });

    if (!module) {
      throw new RpcException({
        message: `El modulo con id ${id} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return module;
  }

  async findOneBySlug(slug: string, status = true) {

    const module = await this.modules.findUnique({
      where: { slug: slug, status },
    });

    if (!module) {
      throw new RpcException({
        message: `El modulo con slug ${slug} no existe`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    await this.findOne(id);

    try {
      await this.modules.update({
        where: { id_module: id },
        data: updateModuleDto,
      });

      return this.findOne(id);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException({
        message: `El modulo con id ${id} no pudo ser actualizado`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async remove(id: string) {
    try {
      return this.modules.update({
        where: { id_module: id },
        data: { status: false },
      });
    } catch (error) {
      const message =
        error.message || `El modulo con id ${id} no pudo ser eliminado`;
      throw new RpcException({
        message: message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
