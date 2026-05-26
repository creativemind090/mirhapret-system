import { IsEmail, IsString, Length, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'Reset code must be 6 digits' })
  token: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  new_password: string;
}
