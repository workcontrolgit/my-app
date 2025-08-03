// approval-workflow.component.ts
import { Component, OnInit, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

export interface ApprovalRule {
  requiredApprovers: string[];
  optionalApprovers: string[];
  managerSelectsSupervisor?: boolean;
}

export interface Approval {
  approverRole: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string | null;
  comments: string | null;
  isRequired: boolean;
  needsSupervisorSelection?: boolean;
  selectedSupervisor?: string;
}

export interface ApprovalWorkflow {
  pdId: string;
  pdTitle: string;
  pdType: 'Custom PD' | 'Standard PD' | 'Expert and Consultant';
  status: 'pending' | 'approved' | 'rejected';
  approvals: Approval[];
  submittedBy: string;
  submittedDate: string;
  availableSupervisors?: string[];
}

export interface ApprovalEvent {
  pdId: string;
  approverRole: string;
  action: 'approve' | 'reject' | 'select-supervisor';
  comments?: string;
  selectedSupervisor?: string;
  timestamp: string;
}

@Component({
  selector: 'app-approval-workflow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './approval-workflow.component.html',
  styleUrls: ['./approval-workflow.component.scss']
})
export class ApprovalWorkflowComponent implements OnInit, OnChanges {
  private modalService = inject(NgbModal);
  private formBuilder = inject(FormBuilder);

  // Input properties for reusability
  @Input() workflow: ApprovalWorkflow = {
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
  };

  @Input() currentUserRole: string = 'Manager';
  @Input() readonly: boolean = false;
  @Input() showProgressBar: boolean = true;
  @Input() showOptionalApprovals: boolean = true;
  @Input() compactMode: boolean = false;

  // Output events for parent components
  @Output() approvalSubmitted = new EventEmitter<ApprovalEvent>();
  @Output() rejectionSubmitted = new EventEmitter<ApprovalEvent>();
  @Output() supervisorSelected = new EventEmitter<ApprovalEvent>();
  @Output() workflowStatusChanged = new EventEmitter<'pending' | 'approved' | 'rejected'>();

  // Forms
  approvalForm!: FormGroup;
  rejectionForm!: FormGroup;
  supervisorSelectionForm!: FormGroup;
  selectedApproval: Approval | null = null;

  constructor() {}

  ngOnInit(): void {
    this.initializeForms();
    this.calculateWorkflowStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workflow'] && this.workflow) {
      this.calculateWorkflowStatus();
    }
  }

  initializeForms(): void {
    this.approvalForm = this.formBuilder.group({
      comments: ['']
    });

    this.rejectionForm = this.formBuilder.group({
      comments: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.supervisorSelectionForm = this.formBuilder.group({
      selectedSupervisor: ['', Validators.required],
      comments: ['']
    });
  }

  get requiredApprovals(): Approval[] {
    return this.workflow?.approvals?.filter(a => a.isRequired) || [];
  }

  get optionalApprovals(): Approval[] {
    return this.workflow?.approvals?.filter(a => !a.isRequired) || [];
  }

  get completedRequired(): number {
    return this.requiredApprovals.filter(a => a.status === 'approved').length;
  }

  get totalRequired(): number {
    return this.requiredApprovals.length;
  }

  get progressPercentage(): number {
    if (this.totalRequired === 0) return 0;
    return (this.completedRequired / this.totalRequired) * 100;
  }

  canUserApprove(approval: Approval): boolean {
    if (this.readonly) return false;
    return approval.approverName === this.getCurrentUserName() && 
           approval.status === 'pending';
  }

  getCurrentUserName(): string {
    const userMap: { [key: string]: string } = {
      'Supervisor': 'Jane Smith',
      'Manager': 'Bob Wilson',
      'Reviewer': 'John Doe'
    };
    return userMap[this.currentUserRole] || '';
  }

  needsSupervisorSelection(approval: Approval): boolean {
    return !!(approval.needsSupervisorSelection && 
             approval.status === 'pending' && 
             this.canUserApprove(approval));
  }

  getPdTypeDescription(pdType: string): string {
    switch (pdType) {
      case 'Custom PD':
        return 'Requires approval from Supervisor and Manager';
      case 'Standard PD':
        return 'Requires approval from Manager only';
      case 'Expert and Consultant':
        return 'Requires Manager to select and get pre-approval from Supervisor';
      default:
        return '';
    }
  }

  calculateWorkflowStatus(): void {
    if (!this.workflow) return;
    
    const hasRejection = this.workflow.approvals.some(a => a.status === 'rejected');
    if (hasRejection) {
      this.workflow.status = 'rejected';
      this.workflowStatusChanged.emit('rejected');
      return;
    }

    const allRequiredApproved = this.requiredApprovals.every(a => a.status === 'approved');
    if (allRequiredApproved) {
      this.workflow.status = 'approved';
      this.workflowStatusChanged.emit('approved');
    } else {
      this.workflow.status = 'pending';
      this.workflowStatusChanged.emit('pending');
    }
  }

  openApprovalModal(content: any, approval: Approval): void {
    if (this.readonly) return;
    this.selectedApproval = approval;
    this.approvalForm.reset();
    this.modalService.open(content, { centered: true });
  }

  openRejectionModal(content: any, approval: Approval): void {
    if (this.readonly) return;
    this.selectedApproval = approval;
    this.rejectionForm.reset();
    this.modalService.open(content, { centered: true });
  }

  openSupervisorSelectionModal(content: any, approval: Approval): void {
    if (this.readonly) return;
    this.selectedApproval = approval;
    this.supervisorSelectionForm.reset();
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  submitApproval(): void {
    if (!this.selectedApproval || this.approvalForm.invalid) {
      return;
    }

    const comments = this.approvalForm.get('comments')?.value;
    const event: ApprovalEvent = {
      pdId: this.workflow.pdId,
      approverRole: this.selectedApproval.approverRole,
      action: 'approve',
      comments: comments || undefined,
      timestamp: new Date().toISOString()
    };

    // Update local state
    this.selectedApproval.status = 'approved';
    this.selectedApproval.timestamp = event.timestamp;
    this.selectedApproval.comments = comments || null;
    
    this.calculateWorkflowStatus();
    this.modalService.dismissAll();
    
    // Emit event for parent component
    this.approvalSubmitted.emit(event);
    this.selectedApproval = null;
  }

  submitRejection(): void {
    if (!this.selectedApproval || this.rejectionForm.invalid) {
      return;
    }
    
    const comments = this.rejectionForm.get('comments')?.value;
    const event: ApprovalEvent = {
      pdId: this.workflow.pdId,
      approverRole: this.selectedApproval.approverRole,
      action: 'reject',
      comments,
      timestamp: new Date().toISOString()
    };

    // Update local state
    this.selectedApproval.status = 'rejected';
    this.selectedApproval.timestamp = event.timestamp;
    this.selectedApproval.comments = comments;
    
    this.calculateWorkflowStatus();
    this.modalService.dismissAll();
    
    // Emit event for parent component
    this.rejectionSubmitted.emit(event);
    this.selectedApproval = null;
  }

  submitSupervisorSelection(): void {
    if (!this.selectedApproval || this.supervisorSelectionForm.invalid) {
      return;
    }

    const selectedSupervisor = this.supervisorSelectionForm.get('selectedSupervisor')?.value;
    const comments = this.supervisorSelectionForm.get('comments')?.value;

    const event: ApprovalEvent = {
      pdId: this.workflow.pdId,
      approverRole: this.selectedApproval.approverRole,
      action: 'select-supervisor',
      comments: comments || undefined,
      selectedSupervisor,
      timestamp: new Date().toISOString()
    };

    // Update local state
    this.selectedApproval.selectedSupervisor = selectedSupervisor;
    this.selectedApproval.status = 'approved';
    this.selectedApproval.timestamp = event.timestamp;
    this.selectedApproval.comments = comments || `Pre-approved by selected supervisor: ${selectedSupervisor}`;

    // Add the selected supervisor as an approved step
    const supervisorApproval: Approval = {
      approverRole: 'Supervisor',
      approverName: selectedSupervisor,
      status: 'approved',
      timestamp: event.timestamp,
      comments: 'Pre-approved through manager selection process',
      isRequired: true
    };

    this.workflow.approvals.push(supervisorApproval);
    
    this.calculateWorkflowStatus();
    this.modalService.dismissAll();
    
    // Emit event for parent component
    this.supervisorSelected.emit(event);
    this.selectedApproval = null;
  }

  // Form validation helpers
  get rejectionCommentsControl() {
    return this.rejectionForm.get('comments');
  }

  get approvalCommentsControl() {
    return this.approvalForm.get('comments');
  }

  get supervisorSelectionControl() {
    return this.supervisorSelectionForm.get('selectedSupervisor');
  }

  get supervisorCommentsControl() {
    return this.supervisorSelectionForm.get('comments');
  }

  isRejectionFormValid(): boolean {
    return this.rejectionForm.valid;
  }

  getRejectionErrorMessage(): string {
    const control = this.rejectionCommentsControl;
    if (control?.hasError('required')) {
      return 'Rejection reason is required';
    }
    if (control?.hasError('minlength')) {
      return 'Please provide at least 10 characters explaining the rejection';
    }
    return '';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved': return 'bi-check-circle-fill';
      case 'rejected': return 'bi-x-circle-fill';
      case 'pending': return 'bi-clock-fill';
      default: return 'bi-question-circle';
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  }
}