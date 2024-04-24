import { IsOptional, IsString } from 'class-validator';
import { Filter } from 'src/contracts/filter.contract';

export class RoleFilter implements Filter {
  @IsOptional()
  @IsString()
  name?: string;
}
