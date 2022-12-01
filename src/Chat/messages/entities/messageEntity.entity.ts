import { InboxEntity } from 'src/Chat/inbox/entities/InboxEntity.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
@Entity({ name: 'message' })
export class messageEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @CreateDateColumn()
  created_at: Date;
  @ManyToOne(() => User, (uSenderID: User) => uSenderID.messages, {
    nullable: true,
  })
  @JoinColumn({ name: 'userSenderID' })
  uSenderID: User;

  @ManyToOne(() => InboxEntity, (InobxID: InboxEntity) => InobxID.message, {
    nullable: true,
  })
  @JoinColumn({ name: 'Inbox messages' })
  InobxID: InboxEntity;
    

}
