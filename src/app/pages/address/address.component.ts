import { Component, ViewChild, AfterViewInit } from '@angular/core';
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
  styleUrl: './address.component.css'
})
export class AddressComponent implements AfterViewInit {
  @ViewChild(AddressManagerComponent) addressManager!: AddressManagerComponent;
  
  title = 'Address Management';
  addresses: Address[] = [];

  ngAfterViewInit() {
    // Get initial addresses and set up refresh mechanism
    this.refreshAddresses();
    
    // Poll for address changes every 2 seconds for demo purposes
    // In a real app, you'd use observables or event emitters
    setInterval(() => {
      this.refreshAddresses();
    }, 2000);
  }

  refreshAddresses() {
    if (this.addressManager) {
      this.addresses = this.addressManager.getAddresses();
    }
  }

  get addressesJson(): string {
    return JSON.stringify(this.addresses, null, 2);
  }
}