import { User } from 'src/modules/user/entities/user.entity';
import { BaseSerializer } from './base.serializer';

export class MetaUserSerializer extends BaseSerializer<User> {
  serialize(item: User): any {
    const roles = item.roles?.map((role) => {
      return {
        id: role.id,
        name: role.name,
      };
    });

    return {
      id: item.id,
      email: item.email,
      name: item.fullName,
      status: item.status,
      roles: roles,
      createdAt: item.createdAt.toISOString(),
    };
  }
}
