import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  TableInheritance,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { Role } from '../../role/entities/role.entity';
import { UserSession } from './user-session.entity';
import { UserActivationCode } from './user-activation-code.entity';

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @Column()
  type: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ name: 'is_visible', type: 'boolean', default: true })
  isVisible: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: false })
  @JoinTable()
  roles: Role[];

  @OneToMany(() => UserSession, (userSession) => userSession.user, {
    eager: false,
  })
  @JoinColumn()
  userSessions: UserSession[];

  @OneToMany(
    () => UserActivationCode,
    (activationCode) => activationCode.user,
    { eager: false },
  )
  activationCodes: UserActivationCode[];
}
