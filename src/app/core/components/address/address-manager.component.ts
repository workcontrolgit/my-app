// address-manager.component.ts
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

@Component({
  selector: 'app-address-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-manager.component.html',
  styleUrls: []
})
export class AddressManagerComponent implements OnInit {
  @ViewChild('addressModal') addressModal!: TemplateRef<any>;
  
  addresses: Address[] = [];
  addressForm!: FormGroup;
  isEditMode = false;
  editingAddress: Address | null = null;
  private modalRef: NgbModalRef | null = null;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    // Initialize with sample data - replace with actual data loading
    this.loadAddresses();
  }

  private initializeForm() {
    this.addressForm = this.fb.group({
      type: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
      isDefault: [false]
    });
  }

  private loadAddresses() {
    // Sample data - replace with actual service call
    this.addresses = [
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
    ];
  }

  openAddressModal() {
    this.isEditMode = false;
    this.editingAddress = null;
    this.resetForm();
    this.modalRef = this.modalService.open(this.addressModal, { 
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }

  editAddress(address: Address) {
    this.isEditMode = true;
    this.editingAddress = address;
    this.populateForm(address);
    this.modalRef = this.modalService.open(this.addressModal, { 
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }

  private resetForm() {
    this.addressForm.reset();
    this.addressForm.patchValue({
      type: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false
    });
  }

  private populateForm(address: Address) {
    this.addressForm.patchValue({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault || false
    });
  }

  saveAddress(modal: NgbModalRef) {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.value;
      
      if (this.isEditMode && this.editingAddress) {
        // Update existing address
        const index = this.addresses.findIndex(a => a.id === this.editingAddress!.id);
        if (index !== -1) {
          const updatedAddress: Address = {
            ...this.editingAddress,
            ...formValue
          };
          
          // Handle default address logic
          if (formValue.isDefault) {
            this.clearDefaultAddresses();
          }
          
          this.addresses[index] = updatedAddress;
        }
      } else {
        // Add new address
        const newAddress: Address = {
          id: this.generateId(),
          ...formValue
        };
        
        // Handle default address logic
        if (formValue.isDefault || this.addresses.length === 0) {
          this.clearDefaultAddresses();
          newAddress.isDefault = true;
        }
        
        this.addresses.push(newAddress);
      }
      
      modal.close();
      this.resetForm();
      
      // Emit event for parent component if needed
      this.onAddressesChanged();
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  deleteAddress(id: string) {
    const addressToDelete = this.addresses.find(a => a.id === id);
    
    if (!addressToDelete) {
      return;
    }

    // Show confirmation dialog
    if (this.showConfirmDialog(`Are you sure you want to delete this ${addressToDelete.type} address?`)) {
      this.addresses = this.addresses.filter(a => a.id !== id);
      
      // If deleted address was default and there are other addresses, make the first one default
      if (addressToDelete.isDefault && this.addresses.length > 0) {
        this.addresses[0].isDefault = true;
      }
      
      this.onAddressesChanged();
    }
  }

  setDefaultAddress(id: string) {
    this.clearDefaultAddresses();
    const address = this.addresses.find(a => a.id === id);
    if (address) {
      address.isDefault = true;
      this.onAddressesChanged();
    }
  }

  private clearDefaultAddresses() {
    this.addresses.forEach(address => {
      address.isDefault = false;
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private markFormGroupTouched() {
    Object.keys(this.addressForm.controls).forEach(key => {
      const control = this.addressForm.get(key);
      control?.markAsTouched();
      
      if (control && control.invalid) {
        control.updateValueAndValidity();
      }
    });
  }

  private showConfirmDialog(message: string): boolean {
    return confirm(message);
  }

  private onAddressesChanged() {
    // This method can be used to emit events or trigger side effects
    // when addresses are modified
    console.log('Addresses updated:', this.addresses);
  }

  // Public methods for parent component interaction
  getAddresses(): Address[] {
    return [...this.addresses]; // Return a copy to prevent external mutations
  }

  setAddresses(addresses: Address[]) {
    this.addresses = [...addresses]; // Create a copy
    this.validateAddresses();
  }

  addAddress(address: Omit<Address, 'id'>): void {
    const newAddress: Address = {
      ...address,
      id: this.generateId()
    };

    // If this is the first address or marked as default, clear other defaults
    if (address.isDefault || this.addresses.length === 0) {
      this.clearDefaultAddresses();
      newAddress.isDefault = true;
    }

    this.addresses.push(newAddress);
    this.onAddressesChanged();
  }

  updateAddress(id: string, updates: Partial<Address>): boolean {
    const index = this.addresses.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }

    // Handle default address logic
    if (updates.isDefault) {
      this.clearDefaultAddresses();
    }

    this.addresses[index] = { ...this.addresses[index], ...updates };
    this.onAddressesChanged();
    return true;
  }

  removeAddress(id: string): boolean {
    const addressToDelete = this.addresses.find(a => a.id === id);
    if (!addressToDelete) {
      return false;
    }

    this.addresses = this.addresses.filter(a => a.id !== id);
    
    // If deleted address was default and there are other addresses, make the first one default
    if (addressToDelete.isDefault && this.addresses.length > 0) {
      this.addresses[0].isDefault = true;
    }
    
    this.onAddressesChanged();
    return true;
  }

  getDefaultAddress(): Address | null {
    return this.addresses.find(a => a.isDefault) || null;
  }

  getAddressesByType(type: Address['type']): Address[] {
    return this.addresses.filter(a => a.type === type);
  }

  hasAddresses(): boolean {
    return this.addresses.length > 0;
  }

  private validateAddresses() {
    // Ensure at least one address is default if addresses exist
    if (this.addresses.length > 0) {
      const hasDefault = this.addresses.some(a => a.isDefault);
      if (!hasDefault) {
        this.addresses[0].isDefault = true;
      }
    }

    // Ensure only one address is marked as default
    let defaultCount = 0;
    let lastDefaultIndex = -1;
    
    this.addresses.forEach((address, index) => {
      if (address.isDefault) {
        defaultCount++;
        lastDefaultIndex = index;
      }
    });

    if (defaultCount > 1) {
      // Clear all defaults except the last one found
      this.addresses.forEach((address, index) => {
        address.isDefault = index === lastDefaultIndex;
      });
    }
  }

  // Utility methods
  getAddressDisplayText(address: Address): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  }

  isFormValid(): boolean {
    return this.addressForm.valid;
  }

  getFormErrors(): { [key: string]: any } {
    const errors: { [key: string]: any } = {};
    Object.keys(this.addressForm.controls).forEach(key => {
      const control = this.addressForm.get(key);
      if (control && control.errors && control.touched) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}