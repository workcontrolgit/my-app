export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export type AddressType = Address['type'];

export interface AddressFormData extends Omit<Address, 'id'> {}