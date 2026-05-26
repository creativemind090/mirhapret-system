import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index('idx_users_email', { synchronize: false })
@Index('idx_users_role', { synchronize: false })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  google_id: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, default: 'customer' })
  role: 'super_admin' | 'admin' | 'store_manager' | 'cashier' | 'customer';

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'uuid', nullable: true })
  store_id: string;

  @Column({ type: 'text', nullable: true })
  avatar_url: string;

  @Column({ type: 'jsonb', nullable: true })
  address: Record<string, any>;

  @Column({ type: 'text', nullable: true, select: false })
  refresh_token: string;

  @Column({ type: 'varchar', length: 6, nullable: true, select: false })
  reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expiry: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Column({ type: 'boolean', default: true })
  email_notifications: boolean;

  @Column({ type: 'boolean', default: false })
  newsletter_subscribed: boolean;
}
