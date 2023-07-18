import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsPageOptionsDto } from './dto/posts-page-options.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() pageOptionsDto: PostsPageOptionsDto) {
    return this.postsService.findAll(pageOptionsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
