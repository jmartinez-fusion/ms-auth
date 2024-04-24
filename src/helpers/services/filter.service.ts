import { SelectQueryBuilder } from 'typeorm';

export class FilterService {
  static applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    filters: { [key: string]: any },
  ): void {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.applyFilter(queryBuilder, key, value);
      }
    });
  }

  private static applyFilter(
    queryBuilder: SelectQueryBuilder<any>,
    key: string,
    value: any,
  ): void {
    switch (key) {
      case 'name':
        this.applyLikeFilter(queryBuilder, 'role.name', value);
        break;
    }
  }

  public static applyLikeFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: string,
  ): void {
    queryBuilder.andWhere(`${field} LIKE :likeValue`, {
      likeValue: `%${value}%`,
    });
  }

  public static applyInFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: any[],
  ): void {
    queryBuilder.andWhere(`${field} IN (:...values)`, { values: value });
  }

  public static applyGreaterThanOrEqualFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: Date,
  ): void {
    queryBuilder.andWhere(`${field} >= :valueGT`, { valueGT: value });
  }

  public static applyLessThanOrEqualFilter(
    queryBuilder: SelectQueryBuilder<any>,
    field: string,
    value: Date,
  ): void {
    queryBuilder.andWhere(`${field} <= :valueLT`, { valueLT: value });
  }
}
