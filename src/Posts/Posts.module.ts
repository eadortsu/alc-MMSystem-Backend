import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './Post.service';
import { PostController } from './Posts.controller';
import { PostEntity } from './Posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  controllers: [PostController],
  providers: [PostsService],
})
export class PostsModule {}
