import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApprovalWorkflowComponent, ApprovalWorkflow } from '../../core/components/workflow/approval-workflow/approval-workflow.component';

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
export class ApprovalComponent implements AfterViewInit {
  @ViewChild(ApprovalWorkflowComponent) approvalWorkflow!: ApprovalWorkflowComponent;
  
  title = 'Approval Workflow';
  workflowData: ApprovalWorkflow | null = null;

  ngAfterViewInit() {
    // Get initial workflow data and set up refresh mechanism
    this.refreshWorkflowData();
    
    // Poll for workflow changes every 3 seconds for demo purposes
    // In a real app, you'd use observables or event emitters
    setInterval(() => {
      this.refreshWorkflowData();
    }, 3000);
  }

  refreshWorkflowData() {
    if (this.approvalWorkflow) {
      this.workflowData = this.approvalWorkflow.workflow;
    }
  }

  get workflowJson(): string {
    return JSON.stringify(this.workflowData, null, 2);
  }

  get approvalSummary() {
    if (!this.workflowData) return null;
    
    const pending = this.workflowData.approvals.filter(a => a.status === 'pending').length;
    const approved = this.workflowData.approvals.filter(a => a.status === 'approved').length;
    const rejected = this.workflowData.approvals.filter(a => a.status === 'rejected').length;
    const total = this.workflowData.approvals.length;
    
    return { pending, approved, rejected, total };
  }
}