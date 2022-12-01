import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePostDto } from './dto/createpos.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostEntity } from './Posts.entity';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}
  async findAllPosts(): Promise<PostEntity[]> {
    //get all the posts
    return await this.postRepo.find();
  }

  async findOnePost(id: any): Promise<PostEntity> {
    //get all the posts
    const post = this.postRepo.findOne({ where: id });
    return post;
  }
  async createPost(createpostDto: CreatePostDto): Promise<PostEntity> {
    const newPost = this.postRepo.create({
      ...createpostDto,
      created_at: new Date(),
    });
    return this.postRepo.save(newPost);
  }
  async updatePost(id: number, updatePosttDto: UpdatePostDto) {
    return this.postRepo.update(id, { ...updatePosttDto });
  }

  async remove(id: number) {
    return this.postRepo.delete(id);
  }
}
