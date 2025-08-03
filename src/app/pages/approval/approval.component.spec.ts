import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalComponent } from './approval.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ApprovalComponent', () => {
  let component: ApprovalComponent;
  let fixture: ComponentFixture<ApprovalComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    await TestBed.configureTestingModule({
      imports: [ApprovalComponent],
      providers: [
        { provide: NgbModal, useValue: modalSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalComponent);
    component = fixture.componentInstance;
    mockModalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Approval Workflow');
  });

  it('should initialize with default workflow data on ngOnInit', () => {
    expect(component.workflowData).toBeDefined();
    expect(component.workflowData?.pdId).toBe('PD-2025-001');
    expect(component.workflowData?.pdTitle).toBe('Senior Software Engineer - Frontend Development');
    expect(component.workflowData?.pdType).toBe('Expert and Consultant');
  });

  it('should have correct dashboard stats', () => {
    expect(component.dashboardStats.pending).toBe(12);
    expect(component.dashboardStats.approved).toBe(45);
    expect(component.dashboardStats.rejected).toBe(3);
    expect(component.dashboardStats.total).toBe(60);
  });

  it('should calculate approval summary correctly', () => {
    const summary = component.approvalSummary;
    expect(summary).toBeDefined();
    if (summary) {
      expect(summary.total).toBeGreaterThan(0);
      expect(summary.pending).toBeGreaterThanOrEqual(0);
      expect(summary.approved).toBeGreaterThanOrEqual(0);
      expect(summary.rejected).toBeGreaterThanOrEqual(0);
    }
  });

  it('should return null for approval summary when no workflow data', () => {
    component.workflowData = null;
    expect(component.approvalSummary).toBeNull();
  });

  it('should format workflow JSON correctly', () => {
    const json = component.workflowJson;
    expect(json).toContain(component.workflowData?.pdId || '');
    expect(json).toContain(component.workflowData?.pdTitle || '');
    
    const parsedJson = JSON.parse(json);
    expect(parsedJson.pdId).toBe('PD-2025-001');
  });

  it('should get correct workflow title', () => {
    expect(component.workflowTitle).toBe('Senior Software Engineer - Frontend Development');
    
    component.workflowData = null;
    expect(component.workflowTitle).toBe('No workflow loaded');
  });

  it('should get correct workflow status', () => {
    expect(component.workflowStatus).toBe('pending');
    
    component.workflowData = null;
    expect(component.workflowStatus).toBe('unknown');
  });

  it('should handle approval submitted event', () => {
    spyOn(console, 'log');
    const mockEvent = {
      pdId: 'PD-2025-001',
      approverRole: 'Manager',
      action: 'approve' as const,
      timestamp: new Date().toISOString()
    };
    
    component.onApprovalSubmitted(mockEvent);
    expect(console.log).toHaveBeenCalledWith('Approval submitted:', mockEvent);
  });

  it('should handle rejection submitted event', () => {
    spyOn(console, 'log');
    const mockEvent = {
      pdId: 'PD-2025-001',
      approverRole: 'Manager',
      action: 'reject' as const,
      comments: 'Not approved',
      timestamp: new Date().toISOString()
    };
    
    component.onRejectionSubmitted(mockEvent);
    expect(console.log).toHaveBeenCalledWith('Rejection submitted:', mockEvent);
  });

  it('should handle supervisor selected event', () => {
    spyOn(console, 'log');
    const mockEvent = {
      pdId: 'PD-2025-001',
      approverRole: 'Manager',
      action: 'select-supervisor' as const,
      selectedSupervisor: 'Alice Johnson',
      timestamp: new Date().toISOString()
    };
    
    component.onSupervisorSelected(mockEvent);
    expect(console.log).toHaveBeenCalledWith('Supervisor selected:', mockEvent);
  });

  it('should handle workflow status changed event', () => {
    spyOn(console, 'log');
    
    component.onWorkflowStatusChanged('approved');
    expect(console.log).toHaveBeenCalledWith('Workflow status changed to:', 'approved');
    expect(component.workflowData?.status).toBe('approved');
  });

  it('should handle workflow updated event', () => {
    spyOn(console, 'log');
    const updatedWorkflow = {
      ...component.workflowData!,
      status: 'approved' as const
    };
    
    component.onWorkflowUpdated(updatedWorkflow);
    expect(console.log).toHaveBeenCalledWith('Workflow updated:', updatedWorkflow);
    expect(component.workflowData).toEqual(updatedWorkflow);
  });

  it('should handle approval added event', () => {
    spyOn(console, 'log');
    const newApproval = {
      approverRole: 'Supervisor',
      approverName: 'Alice Johnson',
      status: 'pending' as const,
      timestamp: null,
      comments: null,
      isRequired: true
    };
    
    component.onApprovalAdded(newApproval);
    expect(console.log).toHaveBeenCalledWith('New approval added:', newApproval);
  });

  it('should handle approval updated event', () => {
    spyOn(console, 'log');
    const updatedApproval = {
      approverRole: 'Manager',
      approverName: 'Bob Wilson',
      status: 'approved' as const,
      timestamp: new Date().toISOString(),
      comments: 'Approved',
      isRequired: true
    };
    
    component.onApprovalUpdated(updatedApproval);
    expect(console.log).toHaveBeenCalledWith('Approval updated:', updatedApproval);
  });

  it('should update dashboard stats correctly', () => {
    const originalPending = component.dashboardStats.pending;
    
    // Mock workflow data change
    if (component.workflowData) {
      component.workflowData.approvals[1].status = 'approved';
      component['updateDashboardStats']();
      
      // Should reflect the changes in the workflow data
      expect(component.dashboardStats.approved).toBeGreaterThan(0);
    }
  });
});