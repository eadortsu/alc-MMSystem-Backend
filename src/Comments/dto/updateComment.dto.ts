import { PartialType } from '@nestjs/swagger';

import { CreateCommentDto } from './createComment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
