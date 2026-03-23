import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'varchar', length: 100, default: 'General' })
  category: string;

  @Column({ type: 'varchar', length: 200, default: 'MirhaPret Editorial' })
  author: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  cover_image: string;

  @Column({ type: 'text', nullable: true })
  cover_gradient: string;

  @Column({ type: 'text', nullable: true })
  content_html: string;

  @Column({ type: 'text', nullable: true })
  content_blocks: string; // JSON string of Block[]

  @Column({ type: 'varchar', length: 50, default: '5 min read' })
  read_time: string;

  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
