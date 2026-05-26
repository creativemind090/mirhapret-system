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

@Entity('pos_sync_logs')
@Index('idx_sync_user', { synchronize: false })
@Index('idx_sync_status', { synchronize: false })
export class POSSyncLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cashier_id: string;

  @Column({ type: 'varchar', length: 50 })
  sync_type: string; // push, pull

  @Column({ type: 'varchar', length: 50 })
  status: string; // pending, success, failed, conflict

  @Column({ type: 'jsonb', nullable: true })
  data_pushed: any; // Data sent to backend

  @Column({ type: 'jsonb', nullable: true })
  data_received: any; // Data received from backend

  @Column({ type: 'jsonb', nullable: true })
  conflict_details: any; // If sync conflict occurred

  @Column({ type: 'varchar', nullable: true })
  error_message: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pos_device_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  synced_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cashier_id' })
  cashier: User;
}
