import { CommentEntity } from 'src/Comments/Comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  title: string;
  @Column('text')
  body: string;

  @ManyToOne(() => User, (user: User) => user.posts, { nullable: true })
  @JoinColumn({ name: 'useID' })
  user: User;

  @OneToMany(() => CommentEntity, (Comment: CommentEntity) => Comment.post, {
    nullable: true,
  })
  comments: CommentEntity[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
