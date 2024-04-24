import { Entity, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from '../../../common/base/base.entity';
import { User } from './user.entity';

@Entity()
export class UserSession extends BaseEntity {
  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.userSessions)
  user: User;
}
