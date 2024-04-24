import { IsArray, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsArray()
  roles: Array<string>;
}
