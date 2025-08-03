import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent } from './address.component';
import { Address } from '../../core/components/address/address-manager.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    await TestBed.configureTestingModule({
      imports: [AddressComponent, RouterTestingModule],
      providers: [
        { provide: NgbModal, useValue: modalSpy },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    mockModalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Address Management');
  });

  it('should initialize with sample addresses on ngOnInit', () => {
    // Component already calls ngOnInit in beforeEach via fixture.detectChanges()
    expect(component.addresses.length).toBe(3);
    expect(component.addresses[0].street).toBe('123 Main St');
    expect(component.addresses[0].isDefault).toBe(true);
    expect(component.addresses[1].type).toBe('work');
    expect(component.addresses[2].type).toBe('other');
  });

  it('should load sample addresses with correct data', () => {
    component.ngOnInit();
    
    const addresses = component.addresses;
    expect(addresses.length).toBe(3);
    
    const homeAddress = addresses.find(addr => addr.type === 'home');
    expect(homeAddress).toBeDefined();
    expect(homeAddress?.street).toBe('123 Main St');
    expect(homeAddress?.city).toBe('Anytown');
    expect(homeAddress?.state).toBe('CA');
    expect(homeAddress?.zipCode).toBe('12345');
    expect(homeAddress?.country).toBe('US');
    expect(homeAddress?.isDefault).toBe(true);
    
    const workAddress = addresses.find(addr => addr.type === 'work');
    expect(workAddress).toBeDefined();
    expect(workAddress?.street).toBe('456 Business Ave');
    expect(workAddress?.isDefault).toBe(false);
  });

  it('should handle addresses change event', () => {
    const newAddresses: Address[] = [
      {
        id: '1',
        type: 'home',
        street: '789 New St',
        city: 'New City',
        state: 'NC',
        zipCode: '99999',
        country: 'US',
        isDefault: true
      }
    ];
    
    spyOn(console, 'log');
    component.onAddressesChange(newAddresses);
    
    expect(component.addresses).toEqual(newAddresses);
    expect(console.log).toHaveBeenCalledWith('Addresses updated from manager:', newAddresses);
  });

  it('should handle address added event', () => {
    const newAddress: Address = {
      id: '4',
      type: 'home',
      street: '999 Test Ave',
      city: 'Test City',
      state: 'TC',
      zipCode: '11111',
      country: 'US',
      isDefault: false
    };
    
    spyOn(console, 'log');
    component.onAddressAdded(newAddress);
    
    expect(console.log).toHaveBeenCalledWith('New address added:', newAddress);
  });

  it('should handle address updated event', () => {
    const updatedAddress: Address = {
      id: '1',
      type: 'home',
      street: '123 Updated St',
      city: 'Updated City',
      state: 'UC',
      zipCode: '22222',
      country: 'US',
      isDefault: true
    };
    
    spyOn(console, 'log');
    component.onAddressUpdated(updatedAddress);
    
    expect(console.log).toHaveBeenCalledWith('Address updated:', updatedAddress);
  });

  it('should handle address deleted event', () => {
    const deletedId = '1';
    
    spyOn(console, 'log');
    component.onAddressDeleted(deletedId);
    
    expect(console.log).toHaveBeenCalledWith('Address deleted:', deletedId);
  });

  it('should return correct JSON representation of addresses', () => {
    component.ngOnInit();
    
    const json = component.addressesJson;
    const parsedAddresses = JSON.parse(json);
    
    expect(parsedAddresses.length).toBe(3);
    expect(parsedAddresses[0].street).toBe('123 Main St');
    expect(json).toContain('123 Main St');
    expect(json).toContain('456 Business Ave');
  });

  it('should return correct address count', () => {
    // Component already has data loaded from ngOnInit
    expect(component.addressCount).toBe(3);
    
    component.addresses = [];
    expect(component.addressCount).toBe(0);
    
    component.addresses = [
      {
        id: '1',
        type: 'home',
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
        isDefault: true
      }
    ];
    expect(component.addressCount).toBe(1);
  });

  it('should return correct default address', () => {
    // Component already has data loaded from ngOnInit
    const defaultAddress = component.defaultAddress;
    
    expect(defaultAddress).not.toBeNull();
    expect(defaultAddress?.isDefault).toBe(true);
    expect(defaultAddress?.street).toBe('123 Main St');
  });

  it('should return null when no default address exists', () => {
    component.addresses = [
      {
        id: '1',
        type: 'home',
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
        isDefault: false
      }
    ];
    
    expect(component.defaultAddress).toBeNull();
  });
});