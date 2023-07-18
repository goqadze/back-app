import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  // @ManyToOne(() => User, (author) => author.posts)
  // author: User;

  @Column()
  authorId: number;
}
