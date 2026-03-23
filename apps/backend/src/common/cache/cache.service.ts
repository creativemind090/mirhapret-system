import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class AppCacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private available = false;
  private readonly logger = new Logger(AppCacheService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: +this.config.get<number>('REDIS_PORT', 6379),
      db: +this.config.get<number>('REDIS_DB', 0),
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    this.client.connect()
      .then(() => {
        this.available = true;
        this.logger.log('AppCacheService: Redis connected');
      })
      .catch(err => {
        this.available = false;
        this.logger.warn(`AppCacheService: Redis unavailable (${err.message}) — running without cache`);
      });

    this.client.on('error', () => { this.available = false; });
    this.client.on('connect', () => { this.available = true; });
  }

  async onModuleDestroy() {
    if (this.client) await this.client.quit().catch(() => {});
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.available) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.available) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {}
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.available || !keys.length) return;
    try {
      await this.client.del(...keys);
    } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.available) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length) await this.client.del(...keys);
    } catch {}
  }

  /**
   * Cache-aside: return cached value if present, otherwise call fn(),
   * store the result, and return it.
   */
  async wrap<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.logger.debug(`Cache HIT: ${key}`);
      return cached;
    }
    const result = await fn();
    await this.set(key, result, ttlSeconds);
    this.logger.debug(`Cache MISS → stored: ${key} (${ttlSeconds}s)`);
    return result;
  }
}
