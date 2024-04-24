import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleFilter } from 'src/helpers/filters/role.filter';
import { RoleSorting } from 'src/helpers/sortings/role.sorting';
import { Pagination } from 'src/contracts';
import { PaginationService } from 'src/helpers/services/pagination.service';
import { FilterService } from '../../helpers/services/filter.service';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService extends PaginationService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly entityManager: EntityManager,
  ) {
    super();
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permissions } = createRoleDto;

    const newRole = this.roleRepository.create({ name });

    if (permissions && permissions.length > 0) {
      const permissionsEntities = await this.entityManager
        .createQueryBuilder(Permission, 'permission')
        .whereInIds(permissions)
        .getMany();

      newRole.permissions = permissionsEntities;
    }

    return this.roleRepository.save(newRole);
  }

  async filter(
    filter: RoleFilter,
    sorting: RoleSorting,
    pagination: Pagination,
  ) {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    FilterService.applyFilters(queryBuilder, filter);
    this.applySorting(queryBuilder, sorting);

    return await this.paginate(queryBuilder, pagination);
  }

  async findOne(id: string) {
    try {
      const role = await this.roleRepository
        .createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions', 'permissions')
        .where('role.id = :id', { id })
        .getOne();

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      return role;
    } catch (error) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOneBy({ id });
    const { name, permissions } = updateRoleDto;

    role.name = name;

    const permissionsEntities = await this.entityManager
      .createQueryBuilder(Permission, 'permission')
      .whereInIds(permissions)
      .getMany();

    role.permissions = permissionsEntities;

    return this.roleRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.softRemove(role);
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    sorting: RoleSorting,
  ): void {
    const { name, createdAt } = sorting;

    if (name) {
      queryBuilder.addOrderBy('role.name', name);
    }

    if (createdAt) {
      queryBuilder.addOrderBy('role.createdAt', createdAt);
    }
  }
}
