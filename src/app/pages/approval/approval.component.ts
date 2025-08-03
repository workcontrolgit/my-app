import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApprovalWorkflowComponent } from '../../core/components/workflow/approval-workflow/approval-workflow.component';

@Component({
  selector: 'app-approval',
  imports: [
    CommonModule,
    RouterLink,
    ApprovalWorkflowComponent
  ],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.css'
})
export class ApprovalComponent {
  title = 'Approval Workflow';
}