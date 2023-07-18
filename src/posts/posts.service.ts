import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PageDto, PageMetaDto } from '../common/dtos';
import { PostsPageOptionsDto } from './dto/posts-page-options.dto';
import axios from 'axios';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(pageOptionsDto: PostsPageOptionsDto) {
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    queryBuilder
      .where('post.authorId = :authorId', { authorId: pageOptionsDto.userId })
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    let itemCount = await queryBuilder.getCount();

    if (itemCount === 0) {
      await this.fetchAndSaveFromExternalApi(pageOptionsDto.userId);

      itemCount = await queryBuilder.getCount();
    }

    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto(pageOptionsDto, itemCount);

    return new PageDto(entities, pageMetaDto);
  }

  async fetchAndSaveFromExternalApi(userId: number) {
    const postsEndpoint = 'https://jsonplaceholder.typicode.com/posts';

    const res = await axios.get(postsEndpoint, {
      params: { userId },
    });

    const posts = res.data.map((post) =>
      this.postRepository.create({
        authorId: post.userId,
        title: post.title,
        body: post.body,
      }),
    );

    return this.postRepository.save(posts);
  }

  findOne(id: number) {
    return this.postRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new NotFoundException();
    }

    return this.postRepository.remove(post);
  }
}
