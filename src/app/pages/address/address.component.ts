import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddressManagerComponent, Address } from '../../core/components/address/address-manager.component';

@Component({
  selector: 'app-address',
  imports: [
    CommonModule,
    RouterLink,
    AddressManagerComponent
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
  title = 'Address Management';
  
  // Initialize with sample data immediately to prevent flash
  addresses: Address[] = [
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
      },
      {
        id: '3',
        type: 'other',
        street: '789 Invoice Rd',
        city: 'Payment City',
        state: 'TX',
        zipCode: '54321',
        country: 'US',
        isDefault: false
      }
    ];

  ngOnInit() {
    // No need to load data here since it's initialized above
  }

  private loadSampleAddresses() {
    // This method is now deprecated since data is initialized at declaration
    // Kept for potential future use with async data loading
  }

  onAddressesChange(updatedAddresses: Address[]) {
    // Handle when addresses array is updated
    this.addresses = updatedAddresses;
    console.log('Addresses updated from manager:', updatedAddresses);
  }

  onAddressAdded(newAddress: Address) {
    // Handle when a new address is added
    console.log('New address added:', newAddress);
  }

  onAddressUpdated(updatedAddress: Address) {
    // Handle when an existing address is updated
    console.log('Address updated:', updatedAddress);
  }

  onAddressDeleted(deletedId: string) {
    // Handle when an address is deleted
    console.log('Address deleted:', deletedId);
  }

  get addressesJson(): string {
    return JSON.stringify(this.addresses, null, 2);
  }

  get addressCount(): number {
    return this.addresses.length;
  }

  get defaultAddress(): Address | null {
    return this.addresses.find(addr => addr.isDefault) || null;
  }
}