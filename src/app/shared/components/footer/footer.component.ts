import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  techStack = [
    'Angular 19',
    'TypeScript',
    'Bootstrap 5',
    'ng-bootstrap'
  ];

  socialLinks = [
    {
      name: 'GitHub Repository',
      icon: 'bi-github',
      url: '#',
      ariaLabel: 'GitHub Repository'
    },
    {
      name: 'Twitter',
      icon: 'bi-twitter',
      url: '#',
      ariaLabel: 'Twitter'
    },
    {
      name: 'LinkedIn',
      icon: 'bi-linkedin',
      url: '#',
      ariaLabel: 'LinkedIn'
    },
    {
      name: 'Discord Community',
      icon: 'bi-discord',
      url: '#',
      ariaLabel: 'Discord Community'
    }
  ];
}