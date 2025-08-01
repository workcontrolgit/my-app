
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

  logout(event: Event): void {
    event.preventDefault();
    // Implement logout logic here
    console.log('Logout clicked');
    // Example: this.authService.logout();
  }  
}
