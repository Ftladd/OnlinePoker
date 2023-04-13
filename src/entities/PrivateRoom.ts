import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, ManyToMany } from 'typeorm';
import { User } from './User';
import { Invitation } from './Invitation';

@Entity()
export class PrivateRoom {
  @PrimaryGeneratedColumn('uuid')
  roomId: string;

  @Column()
  roomName: string;

  @ManyToOne(() => User, (user) => user.privateRooms)
  owner: Relation<User>;

  @ManyToMany(() => Invitation, (invitation) => invitation.privateRoom)
  invitations: Relation<Invitation>;
}
