import { Entity, ManyToMany, JoinTable, Column } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';

@Entity()
export class Role extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: false,
  })
  @JoinTable()
  permissions: Permission[];
}
