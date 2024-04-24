import { BaseSerializer } from './base.serializer';
import { Permission } from 'src/modules/permission/entities/permission.entity';

export class PermissionSerializer extends BaseSerializer<Permission> {
  serialize(item: Permission): any {
    return {
      id: item.id,
      name: item.name,
      label: item.label,
      createdAt: item.createdAt.toISOString(),
    };
  }
}
