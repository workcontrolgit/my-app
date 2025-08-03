
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgbDropdownModule,
    NgbCollapseModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // @ViewChild('addressManager') addressManager!: AddressManagerComponent;
  title = 'my-app';
  isMenuCollapsed = true;

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  closeMenuOnMobile(): void {
    // Close menu on mobile when navigation item is clicked
    if (window.innerWidth < 992) {
      this.isMenuCollapsed = true;
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    // Close any open dropdowns
    this.isMenuCollapsed = true;
    
    // Add subtle animation before logout
    const target = event.target as HTMLElement;
    target.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      // Implement logout logic here
      console.log('Logout clicked');
      // Example: this.authService.logout();
      // this.router.navigate(['/login']);
      
      // Reset button animation
      target.style.transform = 'scale(1)';
    }, 150);
  }
}
