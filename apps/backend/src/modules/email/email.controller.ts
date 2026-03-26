import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { EmailService } from './email.service';
import { Public } from '../../common/decorators/public.decorator';

class ContactFormDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;
}

@Controller('contact')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  async contactForm(@Body() dto: ContactFormDto) {
    await this.emailService.sendContactFormEmail(dto);
    return { message: 'Your message has been received. We\'ll get back to you shortly.' };
  }
}
