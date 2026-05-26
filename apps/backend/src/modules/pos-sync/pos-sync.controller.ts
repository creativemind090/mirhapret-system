import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { POSSyncService } from './pos-sync.service';
import { PushSyncDto, ResolveSyncConflictDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('pos-sync')
@UseGuards(JwtAuthGuard)
@Roles('cashier', 'store_manager', 'admin', 'super_admin')
export class POSSyncController {
  constructor(private posSyncService: POSSyncService) {}

  @Post('push')
  @HttpCode(HttpStatus.CREATED)
  async pushSyncData(
    @CurrentUser() user: any,
    @Body() pushSyncDto: PushSyncDto,
  ) {
    const result = await this.posSyncService.pushSyncData(user.id, pushSyncDto);
    return {
      message: 'Sync data pushed successfully',
      data: result,
    };
  }

  @Get('pull')
  async pullSyncData(
    @CurrentUser() user: any,
    @Query('deviceId') deviceId: string,
    @Query('lastSyncTime') lastSyncTime?: string,
  ) {
    const result = await this.posSyncService.pullSyncData(
      user.id,
      deviceId,
      lastSyncTime ? new Date(lastSyncTime) : new Date(0), // Default to epoch if first sync
    );
    return {
      message: 'Sync data pulled successfully',
      data: result,
    };
  }

  @Get('history')
  async getSyncHistory(
    @CurrentUser() user: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.posSyncService.getSyncHistory(
      user.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Sync history retrieved',
      data: result.logs,
      total: result.total,
    };
  }

  @Get('pending')
  async getPendingSyncs(@CurrentUser() user: any) {
    const logs = await this.posSyncService.getPendingSyncs(user.id);
    return {
      message: 'Pending syncs retrieved',
      data: logs,
    };
  }

  @Get(':id')
  async getSyncStatus(@Param('id') id: string) {
    const log = await this.posSyncService.getSyncStatus(id);
    return {
      message: 'Sync status retrieved',
      data: log,
    };
  }

  @Post('resolve-conflict')
  async resolveSyncConflict(
    @CurrentUser() user: any,
    @Body() resolveSyncConflictDto: ResolveSyncConflictDto,
  ) {
    const result = await this.posSyncService.resolveSyncConflict(
      user.id,
      resolveSyncConflictDto,
    );
    return {
      message: 'Sync conflict resolved',
      data: result,
    };
  }
}
