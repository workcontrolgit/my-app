import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressComponent } from '../../pages/address/address.component';

const routes: Routes = [
  {
    path: '',
    component: AddressComponent,
    title: 'Address Management'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule { }