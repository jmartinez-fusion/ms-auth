import { IsOptional } from 'class-validator';
import { Sorting } from 'src/contracts/sorting.contract';

export class PostSorting implements Sorting {
  @IsOptional()
  id?: 'ASC' | 'DESC';

  @IsOptional()
  title?: 'ASC' | 'DESC';
}
