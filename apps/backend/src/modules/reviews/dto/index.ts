export class CreateReviewDto {
  product_id: string;
  rating: number; // 1-5
  title: string;
  comment?: string;
}

export class UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
}

export class ApproveReviewDto {
  is_approved: boolean;
}
