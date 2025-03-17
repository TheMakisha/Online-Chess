import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "./UserStatus";
import { Friend } from "./Friend";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @OneToOne(() => UserStatus)
  @JoinColumn()
  status: UserStatus;

  @OneToMany(() => Friend, friend => friend.user1)
  friends: Friend[];
}