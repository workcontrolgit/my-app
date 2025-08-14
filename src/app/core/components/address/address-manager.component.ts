// address-manager.component.ts
import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Address, AddressFormData } from '../../../shared/models';

// Re-export Address type for external components
export type { Address };

@Component({
  selector: 'app-address-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-manager.component.html',
  styleUrls: ['./address-manager.component.scss']
})
export class AddressManagerComponent implements OnInit, OnChanges {
  @ViewChild('addressModal') addressModal!: TemplateRef<any>;
  
  @Input() addresses: Address[] = [];
  @Output() addressesChange = new EventEmitter<Address[]>();
  @Output() addressAdded = new EventEmitter<Address>();
  @Output() addressUpdated = new EventEmitter<Address>();
  @Output() addressDeleted = new EventEmitter<string>();
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
    // Component is now driven by input data
    this.validateAddresses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addresses'] && this.addresses) {
      this.validateAddresses();
    }
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

  private emitAddressesChange(): void {
    this.addressesChange.emit([...this.addresses]);
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

  onFormSubmit(event: Event, modal: NgbModalRef) {
    event.preventDefault();
    this.saveAddress(modal);
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
          this.addressUpdated.emit(updatedAddress);
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
        this.addressAdded.emit(newAddress);
      }
      
      modal.close();
      this.resetForm();
      
      // Emit changes to parent component
      this.emitAddressesChange();
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
      
      this.addressDeleted.emit(id);
      this.emitAddressesChange();
    }
  }

  setDefaultAddress(id: string) {
    this.clearDefaultAddresses();
    const address = this.addresses.find(a => a.id === id);
    if (address) {
      address.isDefault = true;
      this.addressUpdated.emit(address);
      this.emitAddressesChange();
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
    // Legacy method - now handled by specific event emitters
    console.log('Addresses updated:', this.addresses);
    this.emitAddressesChange();
  }

  // Public methods for parent component interaction
  getAddresses(): Address[] {
    return [...this.addresses]; // Return a copy to prevent external mutations
  }

  setAddresses(addresses: Address[]) {
    this.addresses = [...addresses]; // Create a copy
    this.validateAddresses();
    this.emitAddressesChange();
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
    this.addressAdded.emit(newAddress);
    this.emitAddressesChange();
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

    const updatedAddress = { ...this.addresses[index], ...updates };
    this.addresses[index] = updatedAddress;
    this.addressUpdated.emit(updatedAddress);
    this.emitAddressesChange();
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
    
    this.addressDeleted.emit(id);
    this.emitAddressesChange();
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