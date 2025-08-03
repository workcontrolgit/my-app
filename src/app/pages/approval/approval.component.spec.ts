import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalComponent } from './approval.component';

describe('ApprovalComponent', () => {
  let component: ApprovalComponent;
  let fixture: ComponentFixture<ApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default workflow', () => {
    expect(component.workflow).toBeDefined();
    expect(component.workflow.pdId).toBe('PD-2025-001');
  });

  it('should calculate approval summary correctly', () => {
    const summary = component.getApprovalSummary();
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.pending).toBeGreaterThanOrEqual(0);
    expect(summary.approved).toBeGreaterThanOrEqual(0);
  });

  it('should format workflow JSON correctly', () => {
    const json = component.workflowJson;
    expect(json).toContain(component.workflow.pdId);
    expect(json).toContain(component.workflow.pdTitle);
  });
});