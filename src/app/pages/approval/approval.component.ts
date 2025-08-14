import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApprovalWorkflowComponent, ApprovalWorkflow } from '../../core/components/workflow/approval-workflow/approval-workflow.component';
import { ApprovalEvent, Approval } from '../../shared/models';

@Component({
  selector: 'app-approval',
  imports: [
    CommonModule,
    RouterLink,
    ApprovalWorkflowComponent
  ],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent implements OnInit {
  title = 'Approval Workflow';
  currentUserRole = 'Manager';
  
  // Dashboard statistics
  dashboardStats = {
    pending: 12,
    approved: 45,
    rejected: 3,
    total: 60
  };

  // Initialize with sample workflow data immediately to prevent flash
  workflowData: ApprovalWorkflow = {
    pdId: 'PD-2025-001',
    pdTitle: 'Senior Software Engineer - Frontend Development',
    pdType: 'Expert and Consultant',
    status: 'pending',
    submittedBy: 'HR Department',
    submittedDate: '2025-07-30T09:00:00Z',
    availableSupervisors: ['Alice Johnson', 'Michael Brown', 'Sarah Davis', 'Robert Wilson'],
    approvals: [
      {
        approverRole: 'Reviewer',
        approverName: 'John Doe',
        status: 'approved',
        timestamp: '2025-07-31T10:00:00Z',
        comments: 'Position requirements are well defined and align with team needs.',
        isRequired: false
      },
      {
        approverRole: 'Manager',
        approverName: 'Bob Wilson',
        status: 'pending',
        timestamp: null,
        comments: null,
        isRequired: true,
        needsSupervisorSelection: true,
        selectedSupervisor: undefined
      },
      {
        approverRole: 'Director',
        approverName: 'Sarah Mitchell',
        status: 'pending',
        timestamp: null,
        comments: null,
        isRequired: true
      }
    ]
  };

  ngOnInit() {
    // No need to load data here since it's initialized above
  }

  private loadSampleWorkflowData() {
    // This method is now deprecated since data is initialized at declaration
    // Kept for potential future use with async data loading
  }

  // Event handlers for workflow component outputs
  onApprovalSubmitted(event: ApprovalEvent) {
    console.log('Approval submitted:', event);
    this.updateDashboardStats();
  }

  onRejectionSubmitted(event: ApprovalEvent) {
    console.log('Rejection submitted:', event);
    this.updateDashboardStats();
  }

  onSupervisorSelected(event: ApprovalEvent) {
    console.log('Supervisor selected:', event);
  }

  onWorkflowStatusChanged(status: 'pending' | 'approved' | 'rejected') {
    console.log('Workflow status changed to:', status);
    this.workflowData.status = status;
  }

  onWorkflowUpdated(workflow: ApprovalWorkflow) {
    console.log('Workflow updated:', workflow);
    this.workflowData = { ...workflow };
  }

  onApprovalAdded(approval: Approval) {
    console.log('New approval added:', approval);
  }

  onApprovalUpdated(approval: Approval) {
    console.log('Approval updated:', approval);
  }

  private updateDashboardStats() {
    const pending = this.workflowData.approvals.filter(a => a.status === 'pending').length;
    const approved = this.workflowData.approvals.filter(a => a.status === 'approved').length;
    const rejected = this.workflowData.approvals.filter(a => a.status === 'rejected').length;
    
    // Update local workflow stats (in a real app, this might update global stats)
    this.dashboardStats = {
      ...this.dashboardStats,
      pending: this.dashboardStats.pending - 1 + pending,
      approved: approved,
      rejected: rejected,
      total: this.dashboardStats.total
    };
  }

  get workflowJson(): string {
    return JSON.stringify(this.workflowData, null, 2);
  }

  get approvalSummary() {
    
    const pending = this.workflowData.approvals.filter(a => a.status === 'pending').length;
    const approved = this.workflowData.approvals.filter(a => a.status === 'approved').length;
    const rejected = this.workflowData.approvals.filter(a => a.status === 'rejected').length;
    const total = this.workflowData.approvals.length;
    
    return { pending, approved, rejected, total };
  }

  get workflowTitle(): string {
    return this.workflowData.pdTitle;
  }

  get workflowStatus(): string {
    return this.workflowData.status;
  }
}