import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/base/base.entity';

@Entity()
export class UserActivationCode extends BaseEntity {
  @Column({ unique: true, length: 6 })
  code: string;

  @Column({ type: 'timestamp', name: 'expiration_date' })
  expirationDate: Date;

  @ManyToOne(() => User, (user) => user.activationCodes)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
