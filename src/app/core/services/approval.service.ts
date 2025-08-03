import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  ApprovalWorkflow, 
  ApprovalEvent, 
  Approval, 
  ApprovalStatus,
  PDType
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private readonly workflows = signal<ApprovalWorkflow[]>([
    {
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
        }
      ]
    },
    {
      pdId: 'PD-2025-002',
      pdTitle: 'Marketing Specialist - Digital Campaigns',
      pdType: 'Standard PD',
      status: 'approved',
      submittedBy: 'Marketing Department',
      submittedDate: '2025-07-28T14:30:00Z',
      approvals: [
        {
          approverRole: 'Manager',
          approverName: 'Sarah Davis',
          status: 'approved',
          timestamp: '2025-07-29T11:15:00Z',
          comments: 'Approved for immediate hiring.',
          isRequired: true
        }
      ]
    }
  ]);

  readonly workflowList = this.workflows.asReadonly();

  getWorkflows(): Observable<ApprovalWorkflow[]> {
    return of([...this.workflows()]).pipe(delay(100));
  }

  getWorkflowById(pdId: string): Observable<ApprovalWorkflow | null> {
    const workflow = this.workflows().find(w => w.pdId === pdId) || null;
    return of(workflow).pipe(delay(100));
  }

  submitApprovalEvent(event: ApprovalEvent): Observable<boolean> {
    const workflows = this.workflows();
    const workflowIndex = workflows.findIndex(w => w.pdId === event.pdId);
    
    if (workflowIndex === -1) {
      return of(false);
    }

    const workflow = workflows[workflowIndex];
    const approvalIndex = workflow.approvals.findIndex(a => a.approverRole === event.approverRole);
    
    if (approvalIndex === -1) {
      return of(false);
    }

    this.workflows.update(workflows => {
      const newWorkflows = [...workflows];
      const updatedWorkflow = { ...newWorkflows[workflowIndex] };
      const updatedApprovals = [...updatedWorkflow.approvals];
      
      updatedApprovals[approvalIndex] = {
        ...updatedApprovals[approvalIndex],
        status: event.action === 'approve' ? 'approved' : 'rejected',
        timestamp: event.timestamp,
        comments: event.comments || null,
        selectedSupervisor: event.selectedSupervisor
      };

      updatedWorkflow.approvals = updatedApprovals;
      updatedWorkflow.status = this.calculateWorkflowStatus(updatedWorkflow);
      newWorkflows[workflowIndex] = updatedWorkflow;
      
      return newWorkflows;
    });

    return of(true).pipe(delay(100));
  }

  addSupervisorApproval(pdId: string, supervisorName: string): Observable<boolean> {
    const workflows = this.workflows();
    const workflowIndex = workflows.findIndex(w => w.pdId === pdId);
    
    if (workflowIndex === -1) {
      return of(false);
    }

    const supervisorApproval: Approval = {
      approverRole: 'Supervisor',
      approverName: supervisorName,
      status: 'approved',
      timestamp: new Date().toISOString(),
      comments: 'Pre-approved through manager selection process',
      isRequired: true
    };

    this.workflows.update(workflows => {
      const newWorkflows = [...workflows];
      const updatedWorkflow = { ...newWorkflows[workflowIndex] };
      updatedWorkflow.approvals = [...updatedWorkflow.approvals, supervisorApproval];
      updatedWorkflow.status = this.calculateWorkflowStatus(updatedWorkflow);
      newWorkflows[workflowIndex] = updatedWorkflow;
      
      return newWorkflows;
    });

    return of(true).pipe(delay(100));
  }

  getWorkflowsByStatus(status: ApprovalStatus): Observable<ApprovalWorkflow[]> {
    const filteredWorkflows = this.workflows().filter(w => w.status === status);
    return of(filteredWorkflows).pipe(delay(100));
  }

  getWorkflowsByType(type: PDType): Observable<ApprovalWorkflow[]> {
    const filteredWorkflows = this.workflows().filter(w => w.pdType === type);
    return of(filteredWorkflows).pipe(delay(100));
  }

  getPendingApprovals(approverName: string): Observable<Approval[]> {
    const pendingApprovals: Approval[] = [];
    
    this.workflows().forEach(workflow => {
      workflow.approvals.forEach(approval => {
        if (approval.approverName === approverName && approval.status === 'pending') {
          pendingApprovals.push(approval);
        }
      });
    });

    return of(pendingApprovals).pipe(delay(100));
  }

  getApprovalStats(): Observable<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const workflows = this.workflows();
    const stats = {
      total: workflows.length,
      pending: workflows.filter(w => w.status === 'pending').length,
      approved: workflows.filter(w => w.status === 'approved').length,
      rejected: workflows.filter(w => w.status === 'rejected').length
    };

    return of(stats).pipe(delay(100));
  }

  private calculateWorkflowStatus(workflow: ApprovalWorkflow): ApprovalStatus {
    const hasRejection = workflow.approvals.some(a => a.status === 'rejected');
    if (hasRejection) {
      return 'rejected';
    }

    const requiredApprovals = workflow.approvals.filter(a => a.isRequired);
    const allRequiredApproved = requiredApprovals.every(a => a.status === 'approved');
    
    return allRequiredApproved ? 'approved' : 'pending';
  }
}