import { IsString, IsOptional } from 'class-validator';

export class TrackProductEventDto {
  @IsString()
  event_type: string; // view, click, purchase, add_to_cart, wishlist

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  session_id?: string;
}
