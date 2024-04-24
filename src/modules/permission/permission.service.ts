import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async all() {
    const queryBuilder =
      this.permissionRepository.createQueryBuilder('permission');

    queryBuilder.addOrderBy('permission.name', 'ASC');

    const [items] = await queryBuilder.getManyAndCount();

    return {
      items,
    };
  }
}
