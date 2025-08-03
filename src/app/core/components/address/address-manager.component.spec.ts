import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressManagerComponent, Address } from './address-manager.component';

describe('AddressManagerComponent', () => {
  let component: AddressManagerComponent;
  let fixture: ComponentFixture<AddressManagerComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  const sampleAddresses: Address[] = [
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

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    const mockModalRef = jasmine.createSpyObj('NgbModalRef', ['result', 'componentInstance', 'close', 'dismiss']);
    modalSpy.open.and.returnValue(mockModalRef);

    await TestBed.configureTestingModule({
      imports: [AddressManagerComponent, ReactiveFormsModule],
      providers: [
        { provide: NgbModal, useValue: modalSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressManagerComponent);
    component = fixture.componentInstance;
    mockModalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    
    // Set input addresses
    component.addresses = [...sampleAddresses];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept addresses as input', () => {
    expect(component.addresses.length).toBe(2);
    expect(component.addresses[0].street).toBe('123 Main St');
    expect(component.addresses[1].type).toBe('work');
  });

  it('should initialize forms correctly', () => {
    expect(component.addressForm).toBeDefined();
    expect(component.addressForm.get('type')).toBeDefined();
    expect(component.addressForm.get('street')).toBeDefined();
    expect(component.addressForm.get('city')).toBeDefined();
    expect(component.addressForm.get('state')).toBeDefined();
    expect(component.addressForm.get('zipCode')).toBeDefined();
    expect(component.addressForm.get('country')).toBeDefined();
  });

  it('should validate form correctly', () => {
    expect(component.isFormValid()).toBeFalse();
    
    component.addressForm.patchValue({
      type: 'home',
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'US'
    });
    
    expect(component.isFormValid()).toBeTrue();
  });

  it('should require all fields for valid form', () => {
    const form = component.addressForm;
    
    // Empty form should be invalid
    expect(form.valid).toBeFalse();
    
    // Fill all required fields
    form.patchValue({
      type: 'home',
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      country: 'US'
    });
    
    expect(form.valid).toBeTrue();
  });

  it('should validate zip code format', () => {
    const zipCodeControl = component.addressForm.get('zipCode');
    
    zipCodeControl?.setValue('123');
    expect(zipCodeControl?.hasError('pattern')).toBeTrue();
    
    zipCodeControl?.setValue('12345');
    expect(zipCodeControl?.hasError('pattern')).toBeFalse();
    
    zipCodeControl?.setValue('12345-6789');
    expect(zipCodeControl?.hasError('pattern')).toBeFalse();
  });

  it('should open modal for editing address', () => {
    const address = component.addresses[0];
    
    component.editAddress(address);
    
    expect(mockModalService.open).toHaveBeenCalled();
    expect(component.editingAddress).toBe(address);
    expect(component.isEditMode).toBe(true);
    expect(component.addressForm.get('street')?.value).toBe(address.street);
  });

  it('should open modal for adding new address', () => {
    component.openAddressModal();
    
    expect(mockModalService.open).toHaveBeenCalled();
    expect(component.editingAddress).toBeNull();
    expect(component.isEditMode).toBe(false);
    expect(component.addressForm.get('street')?.value).toBe('');
  });

  it('should save new address using addAddress method', () => {
    spyOn(component.addressAdded, 'emit');
    spyOn(component.addressesChange, 'emit');
    
    const newAddress = {
      type: 'work' as const,
      street: '789 New St',
      city: 'New City',
      state: 'NC',
      zipCode: '11111',
      country: 'US',
      isDefault: false
    };
    
    const initialLength = component.addresses.length;
    component.addAddress(newAddress);
    
    expect(component.addresses.length).toBe(initialLength + 1);
    expect(component.addressAdded.emit).toHaveBeenCalled();
    expect(component.addressesChange.emit).toHaveBeenCalledWith(component.addresses);
  });

  it('should update existing address using updateAddress method', () => {
    spyOn(component.addressUpdated, 'emit');
    spyOn(component.addressesChange, 'emit');
    
    const addressToEdit = component.addresses[0];
    const updates = {
      street: '999 Updated St',
      city: 'Updated City',
      state: 'UC',
      zipCode: '99999'
    };
    
    const result = component.updateAddress(addressToEdit.id, updates);
    
    expect(result).toBe(true);
    const updatedAddress = component.addresses.find(a => a.id === addressToEdit.id);
    expect(updatedAddress?.street).toBe('999 Updated St');
    expect(component.addressUpdated.emit).toHaveBeenCalled();
    expect(component.addressesChange.emit).toHaveBeenCalledWith(component.addresses);
  });

  it('should delete address and emit events', () => {
    spyOn(component.addressDeleted, 'emit');
    spyOn(component.addressesChange, 'emit');
    spyOn(window, 'confirm').and.returnValue(true);
    
    const addressToDelete = component.addresses[0];
    const initialLength = component.addresses.length;
    
    component.deleteAddress(addressToDelete.id);
    
    expect(component.addresses.length).toBe(initialLength - 1);
    expect(component.addresses.find(a => a.id === addressToDelete.id)).toBeUndefined();
    expect(component.addressDeleted.emit).toHaveBeenCalledWith(addressToDelete.id);
    expect(component.addressesChange.emit).toHaveBeenCalledWith(component.addresses);
  });

  it('should not delete address when confirmation is cancelled', () => {
    spyOn(component.addressDeleted, 'emit');
    spyOn(window, 'confirm').and.returnValue(false);
    
    const initialLength = component.addresses.length;
    component.deleteAddress('1');
    
    expect(component.addresses.length).toBe(initialLength);
    expect(component.addressDeleted.emit).not.toHaveBeenCalled();
  });

  it('should set default address and emit events', () => {
    spyOn(component.addressesChange, 'emit');
    
    const addressToSetDefault = component.addresses[1]; // Work address
    expect(addressToSetDefault.isDefault).toBeFalse();
    
    component.setDefaultAddress(addressToSetDefault.id);
    
    // Check that only the selected address is default
    // Note: the component validation logic ensures only one address is default
    const defaultAddresses = component.addresses.filter(a => a.isDefault);
    expect(defaultAddresses.length).toBe(1);
    expect(component.addresses[1].isDefault).toBeTrue();
    expect(component.addressesChange.emit).toHaveBeenCalledWith(component.addresses);
  });

  it('should generate unique IDs for new addresses', () => {
    const address1 = {
      type: 'home' as const,
      street: '111 First St',
      city: 'City1',
      state: 'C1',
      zipCode: '11111',
      country: 'US',
      isDefault: false
    };
    
    const address2 = {
      type: 'work' as const,
      street: '222 Second St',
      city: 'City2',
      state: 'C2',
      zipCode: '22222',
      country: 'US',
      isDefault: false
    };
    
    component.addAddress(address1);
    component.addAddress(address2);
    
    const ids = component.addresses.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should get form errors correctly', () => {
    const streetControl = component.addressForm.get('street');
    streetControl?.markAsTouched();
    
    const errors = component.getFormErrors();
    expect(errors['street']).toBeDefined();
    expect(errors['street']['required']).toBe(true);
  });

  it('should validate addresses correctly', () => {
    // Component has validateAddresses as private, so we test through public interface
    expect(component.addresses.length).toBe(2);
    expect(component.addresses.some(a => a.isDefault)).toBe(true);
  });

  it('should get default address correctly', () => {
    const defaultAddress = component.getDefaultAddress();
    expect(defaultAddress).not.toBeNull();
    expect(defaultAddress?.isDefault).toBe(true);
    // The validateAddresses method may have adjusted which address is default
    // so we just verify that there is a default address
    const allDefaultAddresses = component.addresses.filter(a => a.isDefault);
    expect(allDefaultAddresses.length).toBe(1);
  });

  it('should get addresses by type correctly', () => {
    const homeAddresses = component.getAddressesByType('home');
    expect(homeAddresses.length).toBe(1);
    expect(homeAddresses[0].street).toBe('123 Main St');
    
    const workAddresses = component.getAddressesByType('work');
    expect(workAddresses.length).toBe(1);
    expect(workAddresses[0].street).toBe('456 Business Ave');
  });

  it('should check if has addresses correctly', () => {
    expect(component.hasAddresses()).toBe(true);
    
    component.addresses = [];
    expect(component.hasAddresses()).toBe(false);
  });

  it('should get address display text correctly', () => {
    const address = component.addresses[0];
    const displayText = component.getAddressDisplayText(address);
    expect(displayText).toBe('123 Main St, Anytown, CA 12345');
  });
});