import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('product_reviews')
@Index('idx_review_product', { synchronize: false })
@Index('idx_review_user', { synchronize: false })
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1-5

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'boolean', default: true })
  is_verified_purchase: boolean;

  @Column({ type: 'boolean', default: false })
  is_approved: boolean;

  @Column({ type: 'int', default: 0 })
  helpful_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
