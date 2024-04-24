import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Filter } from 'src/contracts/filter.contract';
import { UserStatus } from 'src/modules/user/entities/user.entity';

export class UserFilter implements Filter {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  roles?: Array<any>;

  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  statuses?: UserStatus[];
}
