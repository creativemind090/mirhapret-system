export class InitiatePaymentDto {
  order_id: string;
  amount: number;
  currency?: string; // USD, PKR, etc
  method: string; // card, bank, wallet
  payment_method_id?: string; // If using saved payment method
}

export class ConfirmPaymentDto {
  order_id: string;
  payment_intent_id: string;
  payment_method_id?: string;
}

export class CreatePaymentMethodDto {
  method_type: string;
  provider?: string;
  details?: any;
  is_default?: boolean;
}
