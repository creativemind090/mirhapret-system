import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, In, Repository } from 'typeorm';
import { User, NewsletterSubscription } from '../../entities';
import { UpdateUserDto, ChangePasswordDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(NewsletterSubscription)
    private newsletterRepository: Repository<NewsletterSubscription>,
  ) {}

  async getUserProfile(userId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: [
          'id',
          'email',
          'first_name',
          'last_name',
          'phone',
          'role',
          'is_active',
          'avatar_url',
          'email_notifications',
          'newsletter_subscribed',
          'created_at',
          'updated_at',
        ],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to fetch user profile: ${error.message}`);
    }
  }

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Check if email is already taken
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingUser) {
          throw new ConflictException('Email already in use');
        }
      }

      await this.usersRepository.update(userId, updateUserDto);
      return this.getUserProfile(userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update user profile: ${error.message}`);
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id: userId })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.old_password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(changePasswordDto.new_password, 10);
      await this.usersRepository.update(userId, {
        password: hashedPassword,
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to change password: ${error.message}`);
    }
  }

  async listUsers(skip: number = 0, take: number = 10): Promise<{ users: User[]; total: number }> {
    try {
      const [users, total] = await this.usersRepository.findAndCount({
        skip,
        take,
        where: { role: Not(In(['admin', 'super_admin', 'cashier', 'store_manager'])) },
        select: [
          'id',
          'email',
          'first_name',
          'last_name',
          'phone',
          'role',
          'is_active',
          'created_at',
          'last_login_at',
        ],
        order: { created_at: 'DESC' },
      });

      return { users, total };
    } catch (error) {
      throw new BadRequestException(`Failed to list users: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      await this.usersRepository.remove(user);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }

  async newsletterSubscribe(email: string): Promise<{ message: string }> {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Invalid email address');
    }

    // If a registered user — also flip their preference flag
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && !user.newsletter_subscribed) {
      await this.usersRepository.update(user.id, { newsletter_subscribed: true });
    }

    // Always upsert into newsletter_subscriptions table so every email is captured
    const existing = await this.newsletterRepository.findOne({ where: { email } });
    if (existing) {
      if (!existing.is_active) {
        await this.newsletterRepository.update(existing.id, { is_active: true });
      }
      return { message: 'You are already subscribed.' };
    }

    await this.newsletterRepository.save(
      this.newsletterRepository.create({
        email,
        first_name: user?.first_name ?? '',
        is_active: true,
      }),
    );

    return { message: 'Thank you for subscribing!' };
  }

  async getNewsletterSubscribers(): Promise<any[]> {
    const subs = await this.newsletterRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
    // Enrich with registered user names where available
    const emails = subs.map(s => s.email);
    const users = emails.length
      ? await this.usersRepository.find({ where: emails.map(e => ({ email: e })) as any })
      : [];
    const userMap = new Map(users.map(u => [u.email, u]));
    return subs.map(s => {
      const u = userMap.get(s.email);
      return {
        id: s.id,
        email: s.email,
        first_name: u?.first_name ?? s.first_name ?? '',
        last_name: u?.last_name ?? '',
        created_at: s.created_at,
      };
    });
  }

  async updatePreferences(
    userId: string,
    preferences: { email_notifications?: boolean; newsletter_subscribed?: boolean },
  ): Promise<{ message: string }> {
    await this.usersRepository.update(userId, preferences);
    return { message: 'Preferences updated successfully' };
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    try {
      const validRoles = ['customer', 'store_manager', 'admin', 'super_admin'];
      if (!validRoles.includes(role)) {
        throw new BadRequestException(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
      }

      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      await this.usersRepository.update(userId, { role: role as any });
      return this.getUserProfile(userId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update user role: ${error.message}`);
    }
  }
}
