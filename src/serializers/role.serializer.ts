import { BaseSerializer } from './base.serializer';
import { Role } from 'src/modules/role/entities/role.entity';

export class RoleSerializer extends BaseSerializer<Role> {
  serialize(item: Role): any {
    const permissions = item.permissions?.map((permission) => {
      return {
        id: permission.id,
        name: permission.name,
        label: permission.label,
      };
    });

    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toISOString(),
      permissions,
    };
  }
}
