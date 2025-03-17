import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.friends)
  user1: User;

  @ManyToOne(() => User, user => user.friends)
  user2: User;
}