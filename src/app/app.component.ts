import { Component, ViewChild  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddressManagerComponent, Address } from './address/address-manager.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddressManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('addressManager') addressManager!: AddressManagerComponent;
  title = 'my-app';
}
