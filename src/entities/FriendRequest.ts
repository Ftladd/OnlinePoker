import { Entity, PrimaryGeneratedColumn, Check, Column, ManyToOne, Relation } from 'typeorm';
import { User } from './User';

@Entity()
@Check(`"status" = 'pending' | "status" = 'accepted' | "status" = 'declined'`)
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  friendRequestId:string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: Relation<User>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  receiver: Relation<User>;

  @Column({ default: 'pending' })
  status: string;
}
