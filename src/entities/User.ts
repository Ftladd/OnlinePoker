import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { FriendRequest } from './FriendRequest';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 20000 })
  stackSize: number;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  friendRequestsSent: Relation<FriendRequest>[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  friendRequestsReceived: Relation<FriendRequest>[];
}
