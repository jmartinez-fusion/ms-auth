import { IsOptional } from 'class-validator';
import { Sorting } from 'src/contracts/sorting.contract';

export class UserSorting implements Sorting {
  @IsOptional()
  name?: 'ASC' | 'DESC';

  @IsOptional()
  email?: 'ASC' | 'DESC';

  @IsOptional()
  status?: 'ASC' | 'DESC';

  @IsOptional()
  createdAt?: 'ASC' | 'DESC';
}
