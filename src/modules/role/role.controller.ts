import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FilterParams } from 'src/helpers/decorators/filter.decorator';
import { SortingParams } from 'src/helpers/decorators/sorting.decorator';
import { PaginationParams } from 'src/helpers/decorators/pagination.decorator';
import { Pagination } from 'src/contracts';
import { RoleFilter } from 'src/helpers/filters/role.filter';
import { RoleSorting } from 'src/helpers/sortings/role.sorting';
import { RoleSerializer } from 'src/serializers/role.serializer';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(AuthGuard(), new PermissionsGuard(['roles.list']))
  async list(
    @FilterParams(RoleFilter) filter: RoleFilter,
    @SortingParams(RoleSorting) sorting: RoleSorting,
    @PaginationParams() paginationParams: Pagination,
  ) {
    const { items, pagination } = await this.roleService.filter(
      filter,
      sorting,
      paginationParams,
    );
    const serializer = new RoleSerializer();

    return serializer.respondMany(items, null, pagination);
  }

  @Post()
  @UseGuards(AuthGuard(), new PermissionsGuard(['roles.create']))
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.roleService.create(createRoleDto);

    const serializer = new RoleSerializer();

    return serializer.respond(data);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), new PermissionsGuard(['roles.view']))
  async findOne(@Param('id') id: string) {
    const data = await this.roleService.findOne(id);

    const serializer = new RoleSerializer();

    return serializer.respond(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), new PermissionsGuard(['roles.update']))
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.roleService.update(id, updateRoleDto);

    const serializer = new RoleSerializer();

    return serializer.respond(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), new PermissionsGuard(['roles.delete']))
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(id);
  }
}
