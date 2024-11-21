import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { PaginationDto } from '@common/index';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UUIDGuard } from '@common/guards/uuid-guard.decorator';
import { CreateModuleDto } from '@modules/dto/create-module.dto';
import { UpdateModuleDto } from '@modules/dto/update-modules.dto';
import { ModulesService } from '@modules/modules.service';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @MessagePattern({ cmd: 'create-module' })
  create(@Payload() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @MessagePattern({ cmd: 'find-all-modules' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.modulesService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find-one-module' })
  @UUIDGuard('id')
  async findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return await this.modulesService.findOne(id);
  }

  @MessagePattern({ cmd: 'find-one-module-by-slug' })
  async findOneBySlug(@Payload('slug') slug: string) {
    return await this.modulesService.findOneBySlug(slug);
  }

  @MessagePattern({ cmd: 'update-module' })
  @UUIDGuard('id')
  update(@Payload() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(updateModuleDto.id_module, updateModuleDto);
  }

  @MessagePattern({ cmd: 'remove-module' })
  @UUIDGuard('id')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.modulesService.remove(id);
  }
}
