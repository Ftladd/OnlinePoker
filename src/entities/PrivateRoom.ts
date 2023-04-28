import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, OneToMany } from 'typeorm';
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

  @OneToMany(() => Invitation, (invitation) => invitation.privateRoom, { cascade: ['remove'] })
  invitations: Relation<Invitation>[];
}
