import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalComponent } from '../../pages/approval/approval.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalComponent,
    title: 'Approval Workflow'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRoutingModule { }