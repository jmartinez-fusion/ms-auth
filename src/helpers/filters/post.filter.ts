import { IsOptional, IsString } from 'class-validator';
import { Filter } from 'src/contracts/filter.contract';

export class PostFilter implements Filter {
  @IsOptional()
  @IsString()
  title?: string;
}
