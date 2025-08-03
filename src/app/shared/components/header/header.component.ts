import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgbDropdownModule,
    NgbCollapseModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuCollapsed = true;

  @Output() logout = new EventEmitter<Event>();

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeMenuOnMobile(): void {
    // Close menu on mobile when navigation item is clicked
    if (window.innerWidth < 992) {
      this.isMenuCollapsed = true;
    }
  }

  onLogout(event: Event): void {
    event.preventDefault();
    // Close any open dropdowns
    this.isMenuCollapsed = true;
    
    // Add subtle animation before logout
    const target = event.target as HTMLElement;
    target.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      // Reset button animation
      target.style.transform = 'scale(1)';
      // Emit logout event to parent component
      this.logout.emit(event);
    }, 150);
  }
}