import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressComponent } from './address.component';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty addresses', () => {
    expect(component.addresses).toEqual([]);
  });

  it('should refresh addresses and update JSON', () => {
    const mockAddresses = [
      {
        id: '1',
        type: 'home' as const,
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US',
        isDefault: true
      }
    ];
    
    spyOn(component.addressManager, 'getAddresses').and.returnValue(mockAddresses);
    component.refreshAddresses();
    
    expect(component.addresses).toEqual(mockAddresses);
    expect(component.addressesJson).toContain('Test City');
  });
});