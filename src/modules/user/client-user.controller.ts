import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateClientUserDto } from './dto/create-client-user.dto';
import { MetaUserSerializer } from '../../serializers/meta-user.serializer';
import { ActivateClientUserDto } from './dto/activate-client-user.dto';
import { StakeholderUserCreatedSerializer } from '../../serializers/stakeholder-user-created.serializer';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../guards/permissions.guard';
import { FilterParams } from '../../helpers/decorators/filter.decorator';
import { SortingParams } from '../../helpers/decorators/sorting.decorator';
import { PaginationParams } from '../../helpers/decorators/pagination.decorator';
import { Pagination } from '../../contracts';
import { UserSorting } from '../../helpers/sortings/user.sorting';
import { UserFilter } from '../../helpers/filters/user.filter';
import { ClientUserSerializer } from '../../serializers/client-user.serializer';
import { UserType } from '../../enum/user-type.enum';

@Controller('client-users')
@ApiTags('client users')
export class ClientUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard(), new PermissionsGuard(['client-users.list']))
  async list(
    @FilterParams(UserFilter) filter: UserFilter,
    @SortingParams(UserSorting) sorting: UserSorting,
    @PaginationParams() paginationParams: Pagination,
  ) {
    const { items, pagination } = await this.userService.filter(
      filter,
      sorting,
      paginationParams,
      UserType.clientUser,
    );

    const serializer = new ClientUserSerializer();

    return serializer.respondMany(items, null, pagination);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateClientUserDto })
  async create(@Request() req: any, @Body() dto: CreateClientUserDto) {
    const token = req.headers.authorization?.split(' ')[1];
    const users = await this.userService.createClientUser(token, dto);
    const serializer = new StakeholderUserCreatedSerializer();
    return serializer.respondMany(users);
  }

  @Post('activate')
  @ApiBody({ type: ActivateClientUserDto })
  async activatClientUser(
    @Body() dto: ActivateClientUserDto,
    @Request() req: any,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    const data = await this.userService.activateClientUser(token, dto);

    const serializer = new MetaUserSerializer();

    return serializer.respond(data);
  }

  @Post('list-users')
  @ApiBody({ type: ActivateClientUserDto })
  @HttpCode(HttpStatus.OK)
  async getClientUser(@Body() dto: string[]) {
    return await this.userService.listUsers(dto);
  }
}
