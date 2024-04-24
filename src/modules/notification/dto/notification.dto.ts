import { IsArray, IsObject } from 'class-validator';

export class NotificationDto {
  @IsArray()
  userIds: Array<string>;

  @IsObject()
  metadata: object;
}
