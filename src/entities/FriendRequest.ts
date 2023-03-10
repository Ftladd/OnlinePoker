import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Relation } from 'typeorm';
import { User } from './User';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  friendRequestId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: Relation<User>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  receiver: Relation<User>;

  // The @Column() decorator specifies that this property should be mapped to a
  // database column with an ENUM type, which is a type that can only have one
  // of a fixed set of values. The default: 'pending' option specifies that if
  // no value is provided for this property when a new FriendRequest entity is
  // created, the default value should be 'pending'.
  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'declined';
}