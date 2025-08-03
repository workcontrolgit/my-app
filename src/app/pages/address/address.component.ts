import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddressManagerComponent } from '../../core/components/address/address-manager.component';

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
export class AddressComponent {
  title = 'Address Management';
}