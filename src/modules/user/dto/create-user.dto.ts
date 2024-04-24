import { IsArray, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsArray()
  roles: Array<string>;
}
