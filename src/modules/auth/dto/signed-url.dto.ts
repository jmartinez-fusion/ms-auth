import { IsObject, IsString } from 'class-validator';

export class SignedUrlDto {
  @IsString()
  userEmail: string;

  @IsObject()
  metadata: object;
}
