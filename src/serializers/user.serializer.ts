import { User } from 'src/modules/user/entities/user.entity';
import { BaseSerializer } from './base.serializer';
import { UserType } from '../enum/user-type.enum';

export class UserSerializer extends BaseSerializer<User> {
  serialize(item: User, additionalData: any): any {
    const permissions: Array<any> = additionalData.permissions.map((item) => {
      return {
        id: item.id,
        name: item.name,
        label: item.label,
      };
    });
    const type = item.type;
    if (type === UserType.clientUser) {
      permissions.push({
        id: 'client-33c2-47c0-8482-3e3056174c38',
        name: 'client-users.default',
        label: 'Client Users',
      });
    }
    return {
      accessToken: additionalData.accessToken,
      data: {
        id: item.id,
        email: item.email,
        fullName: item.fullName,
        type: item.type,
        isAdmin: item.isAdmin,
        permissions,
      },
    };
  }
}
