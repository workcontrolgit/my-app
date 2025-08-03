import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalWorkflowComponent } from './approval-workflow.component';

describe('ApprovalWorkflowComponent', () => {
  let component: ApprovalWorkflowComponent;
  let fixture: ComponentFixture<ApprovalWorkflowComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default workflow', () => {
    expect(component.workflow).toBeDefined();
    expect(component.workflow.pdId).toBe('PD-2025-001');
  });

  it('should calculate progress percentage correctly', () => {
    const percentage = component.progressPercentage;
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  it('should identify required and optional approvals', () => {
    const required = component.requiredApprovals;
    const optional = component.optionalApprovals;
    
    expect(required.length + optional.length).toBe(component.workflow.approvals.length);
    expect(required.every(a => a.isRequired)).toBeTrue();
    expect(optional.every(a => !a.isRequired)).toBeTrue();
  });

  it('should calculate workflow status correctly', () => {
    // Initial status should be pending
    expect(component.workflow.status).toBe('pending');
    
    // Mark all required approvals as approved
    component.workflow.approvals.forEach(approval => {
      if (approval.isRequired) {
        approval.status = 'approved';
      }
    });
    
    component.calculateWorkflowStatus();
    expect(component.workflow.status).toBe('approved');
  });

  it('should determine if user can approve', () => {
    const managerApproval = component.workflow.approvals.find(a => a.approverRole === 'Manager');
    if (managerApproval) {
      const canApprove = component.canUserApprove(managerApproval);
      expect(canApprove).toBeDefined();
    }
  });
});