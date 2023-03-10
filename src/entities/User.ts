import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { FriendRequest } from './FriendRequest';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  passwordHash: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: 20000 })
  stackSize: number;

  // @OneToMany(() => User, {onDelete: 'CASCADE'})
  // sender: Relation<User>;

  // @OneToMany(() => User, { onDelete: 'CASCADE' })
  // receiver: Relation<User>;
}

// @ManyToOne(() => User, (user) => user.reviews)
//   user: Relation<User>;
