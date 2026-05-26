import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../../entities';
import { RegisterDto, LoginDto } from './dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  // ─── Token helpers ──────────────────────────────────────────────────────────

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * One-way SHA-256 hash for refresh token storage.
   * Fast (tokens already have entropy) and avoids storing raw tokens in DB.
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateAccessToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m',
      } as any,
    );
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      } as any,
    );
  }

  verifyRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ─── Auth operations ─────────────────────────────────────────────────────────

  async register(registerDto: RegisterDto): Promise<{ user: Omit<User, 'password' | 'refresh_token'>; access_token: string; refresh_token: string }> {
    const { email, password, first_name, last_name, phone } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      role: 'customer',
      is_active: true,
    });

    const savedUser = await this.usersRepository.save(user);

    const access_token = this.generateAccessToken(savedUser.id, savedUser.email, savedUser.role);
    const refresh_token = this.generateRefreshToken(savedUser.id);

    // Store only the hash — raw token never persisted
    await this.usersRepository.update(savedUser.id, {
      refresh_token: this.hashToken(refresh_token),
    });

    const { password: _, refresh_token: __, ...userSafe } = savedUser;
    return { user: userSafe as any, access_token, refresh_token };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password' | 'refresh_token'>; access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    // Constant-time response regardless of whether user exists (prevents user enumeration)
    if (!user) {
      await bcrypt.hash(password, 10); // dummy hash to equalise timing
      this.logger.warn(`[AUDIT] Failed login attempt: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`[AUDIT] Failed login attempt: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = this.generateAccessToken(user.id, user.email, user.role);
    const refresh_token = this.generateRefreshToken(user.id);

    // Store hash + update last login in a single query
    await this.usersRepository.update(user.id, {
      refresh_token: this.hashToken(refresh_token),
      last_login_at: new Date(),
    });

    this.logger.log(`[AUDIT] User login: ${user.id} (${user.email})`);
    const { password: _, refresh_token: __, ...userSafe } = user;
    return { user: userSafe as any, access_token, refresh_token };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const payload = this.verifyRefreshToken(refreshToken);

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.refresh_token')
      .where('user.id = :id', { id: payload.sub })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refresh_token) {
      throw new UnauthorizedException('Session expired, please log in again');
    }

    // Compare hash of incoming token against stored hash
    const incomingHash = this.hashToken(refreshToken);
    if (user.refresh_token !== incomingHash) {
      // Possible token theft — invalidate session immediately
      await this.usersRepository.update(user.id, { refresh_token: null as any });
      throw new UnauthorizedException('Refresh token invalid, session terminated');
    }

    const access_token = this.generateAccessToken(user.id, user.email, user.role);
    const new_refresh_token = this.generateRefreshToken(user.id);

    await this.usersRepository.update(user.id, {
      refresh_token: this.hashToken(new_refresh_token),
    });

    return { access_token, refresh_token: new_refresh_token };
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refresh_token: null as any });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    // Always return the same message to prevent user enumeration
    const genericMessage = 'If an account exists with this email, a reset code has been sent.';

    if (!user || !user.is_active) {
      return { message: genericMessage };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store only the hash — raw OTP is delivered to user via email, never stored in DB
    await this.usersRepository.update(user.id, {
      reset_token: this.hashToken(otp),
      reset_token_expiry: expiry,
    } as any);

    this.logger.log(`[AUDIT] Password reset requested: ${email}`);

    // Send OTP via email (fire-and-forget — don't block or leak errors)
    this.emailService
      .sendPasswordResetOtp({ to: email, firstName: user.first_name, otp })
      .catch((err) => this.logger.error(`OTP email failed for ${email}: ${err.message}`));

    return { message: genericMessage };
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.reset_token')
      .addSelect('user.reset_token_expiry')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || !(user as any).reset_token || !(user as any).reset_token_expiry) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    if ((user as any).reset_token !== this.hashToken(token)) {
      throw new BadRequestException('Invalid reset code');
    }

    if (new Date() > (user as any).reset_token_expiry) {
      throw new BadRequestException('Reset code has expired. Please request a new one.');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.usersRepository.update(user.id, {
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    } as any);

    this.logger.log(`[AUDIT] Password changed: ${email}`);
    return { message: 'Password reset successfully. You can now sign in with your new password.' };
  }

  async googleLogin(idToken: string): Promise<{ user: Omit<User, 'password' | 'refresh_token'>; access_token: string; refresh_token: string }> {
    // Verify Google ID token via Google's tokeninfo endpoint (no extra dependencies required)
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    let payload: any;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Google token verification failed');
      payload = await res.json();
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }

    // Validate audience matches our client ID
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (clientId && payload.aud !== clientId) {
      throw new UnauthorizedException('Google token audience mismatch');
    }

    if (payload.error) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const googleId: string = payload.sub;
    const email: string = payload.email;
    const firstName: string = payload.given_name ?? payload.name?.split(' ')[0] ?? 'User';
    const lastName: string = payload.family_name ?? payload.name?.split(' ').slice(1).join(' ') ?? '';
    const avatarUrl: string = payload.picture ?? '';

    // Find existing user by google_id or email
    let user = await this.usersRepository.findOne({ where: { google_id: googleId } });
    if (!user) {
      user = await this.usersRepository.findOne({ where: { email } });
    }

    if (user) {
      // Update google_id and avatar if missing
      const updates: Partial<User> = { last_login_at: new Date() };
      if (!user.google_id) updates.google_id = googleId;
      if (!user.avatar_url && avatarUrl) updates.avatar_url = avatarUrl;
      await this.usersRepository.update(user.id, updates as any);
      user = { ...user, ...updates } as User;
    } else {
      // Create new user
      const newUser = this.usersRepository.create({
        email,
        first_name: firstName,
        last_name: lastName,
        google_id: googleId,
        avatar_url: avatarUrl,
        role: 'customer',
        is_active: true,
      });
      user = await this.usersRepository.save(newUser);
    }

    const access_token = this.generateAccessToken(user.id, user.email, user.role);
    const refresh_token = this.generateRefreshToken(user.id);

    await this.usersRepository.update(user.id, {
      refresh_token: this.hashToken(refresh_token),
    });

    this.logger.log(`[AUDIT] Google login: ${user.id} (${user.email})`);
    const { password: _, refresh_token: __, ...userSafe } = user as any;
    return { user: userSafe, access_token, refresh_token };
  }

  async validateUser(userId: string): Promise<Omit<User, 'password' | 'refresh_token'> | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'store_id'],
    });
    return user;
  }
}
