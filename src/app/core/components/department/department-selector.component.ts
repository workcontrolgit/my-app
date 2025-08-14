import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Department {
  id: number;
  name: string;
  bureauId: number;
  bureauName: string;
  abbreviation?: string;
  code: string; // 6-digit department code
}

interface Bureau {
  id: number;
  name: string;
  shortName: string;
}

@Component({
  selector: 'app-department-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-selector.component.html',
  styleUrls: ['./department-selector.component.scss']
})
export class DepartmentSelectorComponent implements OnInit {
  @Output() departmentSelected = new EventEmitter<Department>();
  
  searchText = '';
  selectedDepartment: Department | null = null;
  showDropdown = false;
  activeIndex = -1;
  filteredDepartments: Department[] = [];
  isRequired = true;
  isLoading = false;
  showValidationError = false;
  showQuickFilters = true;
  
  allDepartments: Department[] = [
    // Secretary of State
    { id: 1, name: 'Executive Secretariat', bureauId: 1, bureauName: 'Secretary of State', abbreviation: 'S/ES', code: '100001' },
    { id: 2, name: 'Policy Planning Staff', bureauId: 1, bureauName: 'Secretary of State', abbreviation: 'S/P', code: '100002' },
    
    // Deputy Secretary
    { id: 3, name: 'Deputy Secretary Office', bureauId: 2, bureauName: 'Deputy Secretary', code: '200001' },
    
    // Management
    { id: 4, name: 'Bureau of Administration', bureauId: 7, bureauName: 'Management', abbreviation: 'A', code: '700001' },
    { id: 5, name: 'Bureau of Consular Affairs', bureauId: 7, bureauName: 'Management', abbreviation: 'CA', code: '700002' },
    { id: 6, name: 'Bureau of Diplomatic Security', bureauId: 7, bureauName: 'Management', abbreviation: 'DS', code: '700003' },
    { id: 7, name: 'Bureau of Human Resources', bureauId: 7, bureauName: 'Management', abbreviation: 'DGHR', code: '700004' },
    { id: 8, name: 'Bureau of Information Resource Management', bureauId: 7, bureauName: 'Management', abbreviation: 'IRM', code: '700005' },
    { id: 9, name: 'Bureau of Overseas Buildings Operations', bureauId: 7, bureauName: 'Management', abbreviation: 'OBO', code: '700006' },
    
    // Political Affairs
    { id: 10, name: 'Bureau of African Affairs', bureauId: 8, bureauName: 'Political Affairs', abbreviation: 'AF', code: '800001' },
    { id: 11, name: 'Bureau of East Asian and Pacific Affairs', bureauId: 8, bureauName: 'Political Affairs', abbreviation: 'EAP', code: '800002' },
    { id: 12, name: 'Bureau of European and Eurasian Affairs', bureauId: 8, bureauName: 'Political Affairs', abbreviation: 'EUR', code: '800003' },
    { id: 13, name: 'Bureau of Near Eastern Affairs', bureauId: 8, bureauName: 'Political Affairs', abbreviation: 'NEA', code: '800004' },
    { id: 14, name: 'Bureau of South and Central Asian Affairs', bureauId: 8, bureauName: 'Political Affairs', abbreviation: 'SCA', code: '800005' },
    { id: 15, name: 'Bureau of Western Hemisphere Affairs', bureauId: 8, bureauName: 'Political Affairs', abbreviation: 'WHA', code: '800006' },
    
    // Arms Control and International Security
    { id: 16, name: 'Bureau of Arms Control, Verification and Compliance', bureauId: 4, bureauName: 'Arms Control and International Security', abbreviation: 'AVC', code: '400001' },
    { id: 17, name: 'Bureau of International Security and Nonproliferation', bureauId: 4, bureauName: 'Arms Control and International Security', abbreviation: 'ISN', code: '400002' },
    { id: 18, name: 'Bureau of Political-Military Affairs', bureauId: 4, bureauName: 'Arms Control and International Security', abbreviation: 'PM', code: '400003' },
    
    // Economic Growth, Energy, and Environment
    { id: 19, name: 'Bureau of Economic and Business Affairs', bureauId: 5, bureauName: 'Economic Growth, Energy, and Environment', abbreviation: 'EB', code: '500001' },
    { id: 20, name: 'Bureau of Energy Resources', bureauId: 5, bureauName: 'Economic Growth, Energy, and Environment', abbreviation: 'ENR', code: '500002' },
    { id: 21, name: 'Bureau of Oceans and International Environmental Affairs', bureauId: 5, bureauName: 'Economic Growth, Energy, and Environment', abbreviation: 'OES', code: '500003' },
    
    // Public Diplomacy
    { id: 22, name: 'Bureau of Educational and Cultural Affairs', bureauId: 9, bureauName: 'Public Diplomacy', abbreviation: 'ECA', code: '900001' },
    { id: 23, name: 'Bureau of Global Public Affairs', bureauId: 9, bureauName: 'Public Diplomacy', abbreviation: 'GPA', code: '900002' },
    
    // Foreign Assistance
    { id: 24, name: 'Bureau of Population, Refugees, and Migration', bureauId: 6, bureauName: 'Foreign Assistance, Humanitarian Affairs and Religious Freedom', abbreviation: 'PRM', code: '600001' },
    { id: 25, name: 'Bureau of Democracy, Human Rights, and Labor', bureauId: 6, bureauName: 'Foreign Assistance, Humanitarian Affairs and Religious Freedom', abbreviation: 'DRL', code: '600002' },
  ];
  
  commonBureaus: Bureau[] = [
    { id: 8, name: 'Political Affairs', shortName: 'Political' },
    { id: 7, name: 'Management', shortName: 'Management' },
    { id: 4, name: 'Arms Control and International Security', shortName: 'Arms Control' },
    { id: 5, name: 'Economic Growth, Energy, and Environment', shortName: 'Economic' },
  ];
  
  ngOnInit() {
    this.filteredDepartments = [...this.allDepartments];
  }
  
  onSearchChange() {
    this.filterDepartments();
    this.showDropdown = true;
    this.activeIndex = -1;
  }
  
  onFocus() {
    this.showDropdown = true;
    if (this.filteredDepartments.length === 0) {
      this.filteredDepartments = [...this.allDepartments];
    }
  }
  
  onBlur() {
    // Delay hiding to allow click events to register
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  
  filterDepartments() {
    const searchLower = this.searchText.toLowerCase().trim();
    
    if (!searchLower) {
      this.filteredDepartments = [...this.allDepartments];
      return;
    }
    
    this.filteredDepartments = this.allDepartments.filter(dept => 
      dept.name.toLowerCase().includes(searchLower) ||
      dept.bureauName.toLowerCase().includes(searchLower) ||
      dept.code.includes(searchLower) ||
      (dept.abbreviation && dept.abbreviation.toLowerCase().includes(searchLower))
    );
  }
  
  filterByBureau(bureau: Bureau) {
    this.searchText = bureau.name;
    this.filterDepartments();
    this.showDropdown = true;
  }
  
  clearSearch() {
    this.searchText = '';
    this.filteredDepartments = [...this.allDepartments];
    this.showDropdown = true;
  }
  
  selectDepartment(department: Department) {
    this.selectedDepartment = department;
    this.searchText = department.name;
    this.showDropdown = false;
    this.departmentSelected.emit(department);
  }
  
  clearSelection() {
    this.selectedDepartment = null;
    this.searchText = '';
    this.filteredDepartments = [...this.allDepartments];
    this.departmentSelected.emit(null as any);
  }
  
  highlightMatch(text: string, search: string): string {
    if (!search) return text;
    
    const searchRegex = new RegExp(`(${search})`, 'gi');
    return text.replace(searchRegex, '<span class="highlight">$1</span>');
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.showDropdown || this.filteredDepartments.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, this.filteredDepartments.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex >= 0 && this.activeIndex < this.filteredDepartments.length) {
          this.selectDepartment(this.filteredDepartments[this.activeIndex]);
        }
        break;
      case 'Escape':
        this.showDropdown = false;
        this.activeIndex = -1;
        break;
    }
  }

  toggleQuickFilters() {
    this.showQuickFilters = !this.showQuickFilters;
  }
}