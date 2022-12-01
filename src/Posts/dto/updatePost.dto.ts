import { PartialType } from '@nestjs/swagger';

import { CreatePostDto } from './createpos.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
