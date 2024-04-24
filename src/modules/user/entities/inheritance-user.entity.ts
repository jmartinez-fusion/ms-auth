import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class MetaUser extends User {
  @Column()
  MetaField: string;
}

@ChildEntity()
export class ClientUser extends User {
  @Column()
  clientField: string;
}
