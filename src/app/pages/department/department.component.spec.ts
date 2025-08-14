import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRouter } from '@angular/router';

import { DepartmentComponent } from './department.component';

describe('DepartmentComponent', () => {
  let component: DepartmentComponent;
  let fixture: ComponentFixture<DepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentComponent, RouterTestingModule],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title', () => {
    expect(component.title).toBe('Department Management');
  });

  it('should initialize with sample departments', () => {
    expect(component.selectedDepartments.length).toBe(2);
    expect(component.selectedDepartments[0].name).toBe('Bureau of Administration');
    expect(component.selectedDepartments[1].name).toBe('Bureau of African Affairs');
  });

  it('should add department when onDepartmentSelected is called', () => {
    const initialCount = component.selectedDepartments.length;
    const newDepartment = {
      id: 3,
      name: 'New Department',
      bureauId: 9,
      bureauName: 'Test Bureau',
      abbreviation: 'ND',
      code: '900003'
    };

    component.onDepartmentSelected(newDepartment);

    expect(component.selectedDepartments.length).toBe(initialCount + 1);
    expect(component.currentDepartment).toEqual(newDepartment);
  });

  it('should not add department if department is null or has no id', () => {
    const initialCount = component.selectedDepartments.length;
    
    component.onDepartmentSelected(null as any);
    expect(component.selectedDepartments.length).toBe(initialCount);

    component.onDepartmentSelected({} as any);
    expect(component.selectedDepartments.length).toBe(initialCount);
  });

  it('should update existing department when selecting department with same id', () => {
    const existingDepartment = component.selectedDepartments[0];
    const updatedDepartment = {
      ...existingDepartment,
      name: 'Updated Department Name'
    };

    component.onDepartmentSelected(updatedDepartment);

    expect(component.selectedDepartments.length).toBe(2); // Same length
    expect(component.selectedDepartments[0].name).toBe('Updated Department Name');
  });

  it('should remove department', () => {
    const initialCount = component.selectedDepartments.length;
    const departmentToRemove = component.selectedDepartments[0];

    component.removeDepartment(departmentToRemove.id);

    expect(component.selectedDepartments.length).toBe(initialCount - 1);
    expect(component.selectedDepartments.find(d => d.id === departmentToRemove.id)).toBeUndefined();
  });

  it('should clear all departments', () => {
    component.clearAllDepartments();

    expect(component.selectedDepartments.length).toBe(0);
    expect(component.currentDepartment).toBeNull();
  });

  it('should return correct departments JSON', () => {
    const json = component.departmentsJson;
    const parsedJson = JSON.parse(json);

    expect(Array.isArray(parsedJson)).toBeTruthy();
    expect(parsedJson.length).toBe(component.selectedDepartments.length);
  });

  it('should return correct department count', () => {
    expect(component.departmentCount).toBe(component.selectedDepartments.length);
  });

  it('should return unique bureaus', () => {
    const uniqueBureaus = component.uniqueBureaus;
    
    expect(uniqueBureaus.length).toBe(2);
    expect(uniqueBureaus).toContain('Management');
    expect(uniqueBureaus).toContain('Political Affairs');
  });

  it('should track department by id', () => {
    const department = component.selectedDepartments[0];
    const result = component.trackByDepartmentId(0, department);
    
    expect(result).toBe(department.id);
  });

  it('should refresh departments after view init', () => {
    spyOn(component, 'refreshDepartments');
    
    component.ngAfterViewInit();
    
    expect(component.refreshDepartments).toHaveBeenCalled();
  });

  it('should handle empty selected departments', () => {
    component.selectedDepartments = [];
    
    expect(component.departmentCount).toBe(0);
    expect(component.uniqueBureaus.length).toBe(0);
    expect(component.departmentsJson).toBe('[]');
  });
});