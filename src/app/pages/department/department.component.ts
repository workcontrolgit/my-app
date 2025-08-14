import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentSelectorComponent } from '../../core/components/department/department-selector.component';

interface Department {
  id: number;
  name: string;
  bureauId: number;
  bureauName: string;
  abbreviation?: string;
  code: string;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgbModule,
    DepartmentSelectorComponent
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent implements OnInit {
  private modalService = inject(NgbModal);
  
  title = 'Department Management';
  selectedDepartment: Department | null = null;

  ngOnInit() {
    // Initialize with no sample data - user will add departments via modal
  }

  openDepartmentModal(content: any) {
    const modalRef = this.modalService.open(content, { 
      centered: true, 
      size: 'lg',
      backdrop: 'static'
    });
    
    modalRef.result.then(
      (result) => {
        if (result && result.id) {
          this.selectDepartment(result);
        }
      },
      (dismissed) => {
        // Modal was dismissed - no action needed
      }
    );
  }

  selectDepartment(department: Department) {
    if (department && department.id) {
      this.selectedDepartment = department;
      console.log('Department selected:', department);
    }
  }

  onDepartmentSelected(department: Department, modal: any) {
    if (department && department.id) {
      this.selectDepartment(department);
      modal.close(department);
    }
  }


  clearDepartment() {
    this.selectedDepartment = null;
  }

  get departmentJson(): string {
    return JSON.stringify(this.selectedDepartment, null, 2);
  }

  get hasSelectedDepartment(): boolean {
    return this.selectedDepartment !== null;
  }
}