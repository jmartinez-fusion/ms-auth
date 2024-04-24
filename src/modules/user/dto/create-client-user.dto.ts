import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CreateClientUserDto {
  @IsString()
  projectId: string;

  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];
}

export class UserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;
}
