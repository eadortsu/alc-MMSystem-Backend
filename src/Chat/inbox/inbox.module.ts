import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxEntity } from './entities/InboxEntity.entity';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';

@Module({
  imports: [TypeOrmModule.forFeature([InboxEntity])],

  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
