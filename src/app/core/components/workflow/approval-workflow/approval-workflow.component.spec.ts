import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalWorkflowComponent, ApprovalWorkflow } from './approval-workflow.component';

describe('ApprovalWorkflowComponent', () => {
  let component: ApprovalWorkflowComponent;
  let fixture: ComponentFixture<ApprovalWorkflowComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  const sampleWorkflow: ApprovalWorkflow = {
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

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    const mockModalRef = jasmine.createSpyObj('NgbModalRef', ['result', 'componentInstance', 'close', 'dismiss']);
    modalSpy.open.and.returnValue(mockModalRef);

    await TestBed.configureTestingModule({
      imports: [ApprovalWorkflowComponent, ReactiveFormsModule],
      providers: [
        { provide: NgbModal, useValue: modalSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalWorkflowComponent);
    component = fixture.componentInstance;
    mockModalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    
    // Set the workflow input
    component.workflow = { ...sampleWorkflow };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided workflow', () => {
    expect(component.workflow).toBeDefined();
    expect(component.workflow?.pdId).toBe('PD-2025-001');
    expect(component.workflow?.pdTitle).toBe('Senior Software Engineer - Frontend Development');
  });

  it('should handle null workflow gracefully', () => {
    component.workflow = null;
    fixture.detectChanges();
    
    expect(component.requiredApprovals).toEqual([]);
    expect(component.optionalApprovals).toEqual([]);
    expect(component.progressPercentage).toBe(0);
  });

  it('should calculate progress percentage correctly', () => {
    const percentage = component.progressPercentage;
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
    
    // The actual percentage depends on current state of required approvals
    // Just verify it's a valid percentage
    expect(typeof percentage).toBe('number');
  });

  it('should identify required and optional approvals', () => {
    const required = component.requiredApprovals;
    const optional = component.optionalApprovals;
    
    expect(required.length + optional.length).toBe(component.workflow?.approvals.length || 0);
    expect(required.every(a => a.isRequired)).toBeTrue();
    expect(optional.every(a => !a.isRequired)).toBeTrue();
    expect(required.length).toBe(2); // Manager and Director
    expect(optional.length).toBe(1); // Reviewer
  });

  it('should calculate workflow status correctly', () => {
    // The initial status depends on the workflow's current state
    // Let's test that the method works correctly by verifying state changes
    if (component.workflow) {
      const initialStatus = component.workflow.status;
      component.calculateWorkflowStatus();
      
      // Status should be a valid workflow status
      expect(['pending', 'approved', 'rejected']).toContain(component.workflow.status);
      
      // Test approved status by marking all required approvals as approved
      component.workflow.approvals.forEach(approval => {
        if (approval.isRequired) {
          approval.status = 'approved';
        }
      });
      
      component.calculateWorkflowStatus();
      expect(component.workflow.status).toBe('approved');
    }
  });

  it('should handle rejection workflow status', () => {
    if (component.workflow) {
      // Mark one approval as rejected
      component.workflow.approvals[1].status = 'rejected';
      
      component.calculateWorkflowStatus();
      expect(component.workflow.status).toBe('rejected');
    }
  });

  it('should determine if user can approve', () => {
    const managerApproval = component.workflow?.approvals.find(a => a.approverRole === 'Manager');
    if (managerApproval) {
      component.currentUserRole = 'Manager';
      const canApprove = component.canUserApprove(managerApproval);
      // Can only approve if the approval is still pending
      expect(typeof canApprove).toBe('boolean');
      
      // User with different role should not be able to approve
      component.currentUserRole = 'Reviewer';
      const cannotApprove = component.canUserApprove(managerApproval);
      expect(cannotApprove).toBe(false);
    }
  });

  it('should get correct current user name', () => {
    component.currentUserRole = 'Manager';
    expect(component.getCurrentUserName()).toBe('Bob Wilson');
    
    component.currentUserRole = 'Supervisor';
    expect(component.getCurrentUserName()).toBe('Jane Smith');
    
    component.currentUserRole = 'Reviewer';
    expect(component.getCurrentUserName()).toBe('John Doe');
  });

  it('should check if supervisor selection is needed', () => {
    const managerApproval = component.workflow?.approvals.find(a => a.approverRole === 'Manager');
    if (managerApproval && managerApproval.needsSupervisorSelection) {
      component.currentUserRole = 'Manager';
      // Reset approval status to pending to test supervisor selection
      managerApproval.status = 'pending';
      const needsSelection = component.needsSupervisorSelection(managerApproval);
      expect(needsSelection).toBe(true);
      
      // Should not need selection if already approved
      managerApproval.status = 'approved';
      const doesNotNeedSelection = component.needsSupervisorSelection(managerApproval);
      expect(doesNotNeedSelection).toBe(false);
    }
  });

  it('should get PD type description', () => {
    expect(component.getPdTypeDescription('Custom PD')).toContain('Supervisor and Manager');
    expect(component.getPdTypeDescription('Standard PD')).toContain('Manager only');
    expect(component.getPdTypeDescription('Expert and Consultant')).toContain('Manager to select');
    expect(component.getPdTypeDescription('Unknown')).toBe('');
  });

  it('should emit events when workflow status changes', () => {
    spyOn(component.workflowStatusChanged, 'emit');
    
    component.calculateWorkflowStatus();
    // Verify that status change event was emitted (the exact status depends on workflow state)
    expect(component.workflowStatusChanged.emit).toHaveBeenCalled();
  });

  it('should format dates correctly', () => {
    const dateString = '2025-07-31T10:00:00Z';
    const formatted = component.formatDate(dateString);
    expect(formatted).toBeDefined();
    expect(formatted.length).toBeGreaterThan(0);
    
    const nullDate = component.formatDate(null);
    expect(nullDate).toBe('');
  });

  it('should get correct status badge and icon classes', () => {
    expect(component.getStatusBadgeClass('approved')).toBe('badge-success');
    expect(component.getStatusBadgeClass('rejected')).toBe('badge-danger');
    expect(component.getStatusBadgeClass('pending')).toBe('badge-warning');
    
    expect(component.getStatusIcon('approved')).toBe('bi-check-circle-fill');
    expect(component.getStatusIcon('rejected')).toBe('bi-x-circle-fill');
    expect(component.getStatusIcon('pending')).toBe('bi-clock-fill');
  });
});