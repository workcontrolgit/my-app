import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressManagerComponent } from './address-manager.component';

describe('AddressManagerComponent', () => {
  let component: AddressManagerComponent;
  let fixture: ComponentFixture<AddressManagerComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open']);

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sample addresses', () => {
    expect(component.getAddresses().length).toBeGreaterThan(0);
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

  it('should add new address', () => {
    const initialCount = component.getAddresses().length;
    
    component.addAddress({
      type: 'work',
      street: '456 Work Ave',
      city: 'Work City',
      state: 'WC',
      zipCode: '67890',
      country: 'US',
      isDefault: false
    });
    
    expect(component.getAddresses().length).toBe(initialCount + 1);
  });

  it('should set default address correctly', () => {
    const addresses = component.getAddresses();
    const firstId = addresses[0].id;
    const secondId = addresses[1].id;
    
    component.setDefaultAddress(secondId);
    
    const updatedAddresses = component.getAddresses();
    expect(updatedAddresses.find(a => a.id === firstId)?.isDefault).toBeFalse();
    expect(updatedAddresses.find(a => a.id === secondId)?.isDefault).toBeTrue();
  });
});