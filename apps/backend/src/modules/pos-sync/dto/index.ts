export class PushSyncDto {
  device_id: string;
  orders_created: any[];
  orders_updated: any[];
  inventory_changes: any[];
  sync_timestamp: Date;
}

export class ResolveSyncConflictDto {
  sync_log_id: string;
  resolution_type: string; // 'backend_wins' | 'device_wins' | 'manual_merge'
  resolved_data: any;
}
