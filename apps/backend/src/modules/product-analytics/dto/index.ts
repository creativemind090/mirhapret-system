export class TrackProductEventDto {
  event_type: string; // view, click, purchase, add_to_cart, wishlist
  url?: string;
  referrer?: string;
  session_id?: string;
}
