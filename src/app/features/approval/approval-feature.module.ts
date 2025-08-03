import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ApprovalRoutingModule } from './approval-routing.module';
import { ApprovalComponent } from '../../pages/approval/approval.component';
import { ApprovalWorkflowComponent } from '../../core/components/workflow/approval-workflow/approval-workflow.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    ApprovalRoutingModule,
    ApprovalComponent,
    ApprovalWorkflowComponent
  ]
})
export class ApprovalFeatureModule { }