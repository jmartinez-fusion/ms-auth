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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationParams } from 'src/helpers/decorators/pagination.decorator';
import { SortingParams } from 'src/helpers/decorators/sorting.decorator';
import { FilterParams } from 'src/helpers/decorators/filter.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserFilter } from 'src/helpers/filters/user.filter';
import { UserSorting } from 'src/helpers/sortings/user.sorting';
import { Pagination } from 'src/contracts';
import { MetaUserSerializer } from 'src/serializers/meta-user.serializer';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('meta-users')
@ApiTags('meta users')
export class MetaUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard(), new PermissionsGuard(['meta-users.list']))
  async list(
    @FilterParams(UserFilter) filter: UserFilter,
    @SortingParams(UserSorting) sorting: UserSorting,
    @PaginationParams() paginationParams: Pagination,
  ) {
    const { items, pagination } = await this.userService.filter(
      filter,
      sorting,
      paginationParams,
    );
    const serializer = new MetaUserSerializer();

    return serializer.respondMany(items, null, pagination);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @UseGuards(AuthGuard(), new PermissionsGuard(['meta-users.create']))
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);

    const serializer = new MetaUserSerializer();

    return serializer.respond(data);
  }

  @Get(':id')
  @UseGuards(AuthGuard(), new PermissionsGuard(['meta-users.view']))
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(id);

    const serializer = new MetaUserSerializer();

    return serializer.respond(data);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AuthGuard(), new PermissionsGuard(['meta-users.update']))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);

    const serializer = new MetaUserSerializer();

    return serializer.respond(data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), new PermissionsGuard(['meta-users.delete']))
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }

  @Post(':id/status/:status')
  @UseGuards(AuthGuard(), new PermissionsGuard(['meta-users.status']))
  changeStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.userService.changeStatus(id, status);
  }

  @Post('projects/list')
  @UseGuards(AuthGuard())
  async listForProjects(@Body() data: any) {
    const result = await this.userService.listForProjects(data.userIds);

    return result;
  }
}
