import { BaseEntity } from 'src/common/base/base.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Entity, ManyToMany, Column } from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @Column()
  name: string;

  @Column()
  label: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
