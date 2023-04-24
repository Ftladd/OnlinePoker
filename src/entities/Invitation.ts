import {
  Entity,
  PrimaryGeneratedColumn,
  Check,
  Column,
  ManyToOne,
  ManyToMany,
  Relation,
} from 'typeorm';
import { User } from './User';
import { PrivateRoom } from './PrivateRoom';

@Entity()
@Check(`"status" = 'pending' OR "status" = 'accepted' OR "status" = 'declined'`)
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  invitationId: string;

  @ManyToOne(() => User, (user) => user.invitationsSent)
  sender: Relation<User>;

  @ManyToMany(() => User, (user) => user.invitationsReceived)
  invitedUsers: Relation<User>[];

  @ManyToOne(() => PrivateRoom, (privateRoom) => privateRoom.invitations)
  privateRoom: Relation<PrivateRoom>;

  @Column({ default: 'pending' })
  status: string;
}
