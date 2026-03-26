import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  UseGuards,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('newsletter-subscribe')
  @Public()
  @HttpCode(HttpStatus.OK)
  async newsletterSubscribe(@Body('email') email: string) {
    return this.usersService.newsletterSubscribe(email);
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usersService.getUserProfile(user.id);
    return {
      message: 'User profile retrieved successfully',
      data: profile,
    };
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.usersService.updateUserProfile(user.id, updateUserDto);
    return {
      message: 'User profile updated successfully',
      data: updated,
    };
  }

  @Put('preferences')
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() body: { email_notifications?: boolean; newsletter_subscribed?: boolean },
  ) {
    const result = await this.usersService.updatePreferences(user.id, body);
    return result;
  }

  @Post('change-password')
  async changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    const result = await this.usersService.changePassword(user.id, changePasswordDto);
    return result;
  }

  @Get('newsletter-subscribers')
  @Roles('admin', 'super_admin')
  async getNewsletterSubscribers() {
    const result = await this.usersService.getNewsletterSubscribers();
    return {
      message: 'Newsletter subscribers retrieved successfully',
      data: result,
    };
  }

  @Get()
  @Roles('admin', 'super_admin')
  async listUsers(@Query('skip') skip: number = 0, @Query('take') take: number = 10) {
    const result = await this.usersService.listUsers(skip, take);
    return {
      message: 'Users retrieved successfully',
      data: result.users,
      total: result.total,
    };
  }

  @Get(':id')
  @Roles('admin', 'super_admin')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUserProfile(id);
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Put(':id/role')
  @Roles('super_admin')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    const updated = await this.usersService.updateUserRole(id, role);
    return {
      message: 'User role updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return result;
  }
}
