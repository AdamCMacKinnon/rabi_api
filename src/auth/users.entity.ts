import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './enum/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  manager_name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: Role.player })
  role: Role;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;
}
