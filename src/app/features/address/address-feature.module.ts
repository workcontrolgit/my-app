import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AddressRoutingModule } from './address-routing.module';
import { AddressComponent } from '../../pages/address/address.component';
import { AddressManagerComponent } from '../../core/components/address/address-manager.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    AddressRoutingModule,
    AddressComponent,
    AddressManagerComponent
  ]
})
export class AddressFeatureModule { }