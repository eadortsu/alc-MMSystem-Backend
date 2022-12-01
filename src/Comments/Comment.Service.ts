import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { CommentEntity } from './Comment.entity';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commRepo: Repository<CommentEntity>,
  ) {}
  async findAllComments(): Promise<CommentEntity[]> {
    //get all the posts
    return await this.commRepo.find();
  }

  async findOneComment(id: any): Promise<CommentEntity> {
    //get all the posts
    const post = this.commRepo.findOne({ where: id });
    return post;
  }
  async createComment(
    createcommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const newComment = this.commRepo.create({
      ...createcommentDto,
      created_at: new Date(),
    });
    return this.commRepo.save(newComment);
  }
  async updateComment(id: number, updatecommenttDto: UpdateCommentDto) {
    return this.commRepo.update(id, { ...updatecommenttDto });
  }

  async removeComment(id: number) {
    return this.commRepo.delete(id);
  }
}
