import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ short: { limit: 3, ttl: 60000 }, long: { limit: 10, ttl: 3600000 } })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      data: result,
    };
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 3600000 } })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      data: result,
    };
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Public()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto.refresh_token);
    return {
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.id);
    return {
      message: 'Logout successful',
    };
  }

  @Post('google')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 }, long: { limit: 50, ttl: 3600000 } })
  async googleLogin(@Body() body: { id_token: string }) {
    if (!body.id_token) {
      throw new (await import('@nestjs/common').then(m => m.BadRequestException))('id_token is required');
    }
    const result = await this.authService.googleLogin(body.id_token);
    return {
      message: 'Login successful',
      data: result,
    };
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 60000 }, long: { limit: 5, ttl: 3600000 } })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 60000 }, long: { limit: 5, ttl: 3600000 } })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.token,
      resetPasswordDto.new_password,
    );
  }
}
