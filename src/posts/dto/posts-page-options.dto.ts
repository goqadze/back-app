import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PageOptionsDto } from '../../common/dtos';

export class PostsPageOptionsDto extends PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  readonly userId: number;
}
