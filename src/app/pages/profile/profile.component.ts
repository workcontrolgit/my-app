import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    bio: 'Frontend developer passionate about UI/UX design and Angular.',
    avatar: 'https://i.pravatar.cc/150?img=5'
  };

  updateProfile() {
    alert('Profile updated successfully!');
  }
}
