import { User } from 'src/users/entities/user.entity';
import { messageEntity } from 'src/Chat/messages/entities/messageEntity.entity';
import {
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
@Entity({ name: 'message' })
export class InboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (uSenderID: User) => uSenderID.messages, {
    nullable: true,
  })
  @JoinColumn({ name: 'userSenderID' })
  uSenderID: User;
  @ManyToOne(() => User, (uRecieverID: User) => uRecieverID.messages, {
    nullable: true,
  })
  uRecieverID: User;
  @JoinColumn({ name: 'userRecieverID' })
  @OneToMany(() => messageEntity, (message: messageEntity) => message.InobxID, {
    nullable: true,
  })
  @JoinColumn({ name: 'Inbox messages' })
  message: messageEntity[];
}
