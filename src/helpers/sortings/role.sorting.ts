import { IsOptional } from 'class-validator';
import { Sorting } from 'src/contracts/sorting.contract';

export class RoleSorting implements Sorting {
  @IsOptional()
  name?: 'ASC' | 'DESC';

  @IsOptional()
  createdAt?: 'ASC' | 'DESC';
}
