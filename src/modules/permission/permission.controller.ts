import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionSerializer } from 'src/serializers/permission.serializer';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('permissions')
@ApiTags('permissions')
export class PermissionController {
  constructor(private readonly permissions: PermissionService) {}

  @Get()
  @UseGuards(AuthGuard(), new PermissionsGuard(['permissions.list']))
  async list() {
    const { items } = await this.permissions.all();
    const serializer = new PermissionSerializer();

    return serializer.respondMany(items);
  }
}
