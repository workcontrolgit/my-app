import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  // Account Settings
  accountSettings = {
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    twoFactorAuth: false,
    profileVisibility: 'public'
  };

  // Appearance Settings
  appearanceSettings = {
    theme: 'auto',
    language: 'en',
    timezone: 'America/New_York'
  };

  // Privacy Settings
  privacySettings = {
    showEmail: false,
    showProfile: true,
    allowContactForm: true,
    dataCollection: false
  };

  // Available options
  themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto (System)' }
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  profileVisibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'friends', label: 'Friends Only' }
  ];

  saveAccountSettings() {
    console.log('Account settings saved:', this.accountSettings);
    this.showSuccessMessage('Account settings updated successfully!');
  }

  saveAppearanceSettings() {
    console.log('Appearance settings saved:', this.appearanceSettings);
    this.showSuccessMessage('Appearance settings updated successfully!');
  }

  savePrivacySettings() {
    console.log('Privacy settings saved:', this.privacySettings);
    this.showSuccessMessage('Privacy settings updated successfully!');
  }

  exportData() {
    const data = {
      accountSettings: this.accountSettings,
      appearanceSettings: this.appearanceSettings,
      privacySettings: this.privacySettings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-settings-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    this.showSuccessMessage('Settings exported successfully!');
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      // Reset to defaults
      this.accountSettings = {
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        twoFactorAuth: false,
        profileVisibility: 'public'
      };
      
      this.appearanceSettings = {
        theme: 'auto',
        language: 'en',
        timezone: 'America/New_York'
      };
      
      this.privacySettings = {
        showEmail: false,
        showProfile: true,
        allowContactForm: true,
        dataCollection: false
      };
      
      this.showSuccessMessage('All data cleared and reset to defaults.');
    }
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      if (confirm('This is your final confirmation. Are you absolutely sure you want to delete your account?')) {
        console.log('Account deletion requested');
        alert('Account deletion request submitted. You will receive a confirmation email.');
      }
    }
  }

  private showSuccessMessage(message: string) {
    // In a real app, you might use a toast service or similar
    alert(message);
  }
}