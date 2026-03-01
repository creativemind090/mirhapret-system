export class CreateAddressDto {
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
  address_type?: 'shipping' | 'billing' | 'both';
}

export class UpdateAddressDto {
  street_address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
  address_type?: 'shipping' | 'billing' | 'both';
}
