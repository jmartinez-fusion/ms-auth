import { BaseSerializer } from './base.serializer';

export class AuthenticateByUrlSerializer extends BaseSerializer<any> {
  serialize(data: any): any {
    return data;
  }
}
