import { User } from 'src/modules/user/entities/user.entity';
import { BaseSerializer } from './base.serializer';

export class ClientUserSerializer extends BaseSerializer<User> {
  serialize(item: User): any {
    return {
      id: item.id,
      email: item.email,
      name: item.fullName,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
    };
  }
}
