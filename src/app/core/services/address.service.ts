import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Address, AddressFormData } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly addresses = signal<Address[]>([
    {
      id: '1',
      type: 'home',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'US',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      street: '456 Business Ave',
      city: 'Corporate City',
      state: 'NY',
      zipCode: '67890',
      country: 'US',
      isDefault: false
    }
  ]);

  readonly addressList = this.addresses.asReadonly();

  getAddresses(): Observable<Address[]> {
    return of([...this.addresses()]).pipe(delay(100));
  }

  getAddressById(id: string): Observable<Address | null> {
    const address = this.addresses().find(a => a.id === id) || null;
    return of(address).pipe(delay(100));
  }

  addAddress(addressData: AddressFormData): Observable<Address> {
    const newAddress: Address = {
      ...addressData,
      id: this.generateId()
    };

    if (addressData.isDefault || this.addresses().length === 0) {
      this.clearDefaultAddresses();
      newAddress.isDefault = true;
    }

    this.addresses.update(addresses => [...addresses, newAddress]);
    return of(newAddress).pipe(delay(100));
  }

  updateAddress(id: string, updates: Partial<AddressFormData>): Observable<Address | null> {
    const currentAddresses = this.addresses();
    const index = currentAddresses.findIndex(a => a.id === id);
    
    if (index === -1) {
      return of(null);
    }

    if (updates.isDefault) {
      this.clearDefaultAddresses();
    }

    const updatedAddress = { ...currentAddresses[index], ...updates };
    
    this.addresses.update(addresses => {
      const newAddresses = [...addresses];
      newAddresses[index] = updatedAddress;
      return newAddresses;
    });

    return of(updatedAddress).pipe(delay(100));
  }

  deleteAddress(id: string): Observable<boolean> {
    const currentAddresses = this.addresses();
    const addressToDelete = currentAddresses.find(a => a.id === id);
    
    if (!addressToDelete) {
      return of(false);
    }

    this.addresses.update(addresses => addresses.filter(a => a.id !== id));

    // If deleted address was default and there are other addresses, make the first one default
    if (addressToDelete.isDefault && this.addresses().length > 0) {
      this.setDefaultAddress(this.addresses()[0].id);
    }

    return of(true).pipe(delay(100));
  }

  setDefaultAddress(id: string): Observable<boolean> {
    const currentAddresses = this.addresses();
    const address = currentAddresses.find(a => a.id === id);
    
    if (!address) {
      return of(false);
    }

    this.clearDefaultAddresses();
    
    this.addresses.update(addresses => 
      addresses.map(a => a.id === id ? { ...a, isDefault: true } : a)
    );

    return of(true).pipe(delay(100));
  }

  getDefaultAddress(): Observable<Address | null> {
    const defaultAddress = this.addresses().find(a => a.isDefault) || null;
    return of(defaultAddress).pipe(delay(100));
  }

  getAddressesByType(type: Address['type']): Observable<Address[]> {
    const filteredAddresses = this.addresses().filter(a => a.type === type);
    return of(filteredAddresses).pipe(delay(100));
  }

  private clearDefaultAddresses(): void {
    this.addresses.update(addresses => 
      addresses.map(a => ({ ...a, isDefault: false }))
    );
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}