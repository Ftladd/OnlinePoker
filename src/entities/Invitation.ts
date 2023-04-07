import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, Relation } from 'typeorm';
import { User } from './User';
import { PrivateRoom } from './PrivateRoom';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.invitationsSent)
  sender: Relation<User>;

  @ManyToOne(() => User, (user) => user.invitationsReceived)
  invitedUsers: Relation<User>[];

  @ManyToMany(() => PrivateRoom, (privateRoom) => privateRoom.invitations)
  privateRoom: Relation<PrivateRoom>;
}
