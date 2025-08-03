/**
 * Date utility functions for the application
 */

export class DateUtils {
  /**
   * Formats a date string to a localized format
   * @param dateString - ISO date string or null
   * @returns Formatted date string or empty string
   */
  static formatDate(dateString: string | null): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  }

  /**
   * Formats a date to a shorter format (date only)
   * @param dateString - ISO date string or null
   * @returns Formatted date string or empty string
   */
  static formatDateOnly(dateString: string | null): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Gets the current ISO date string
   * @returns Current date in ISO format
   */
  static getCurrentISOString(): string {
    return new Date().toISOString();
  }

  /**
   * Checks if a date is today
   * @param dateString - ISO date string
   * @returns True if the date is today
   */
  static isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Gets the time difference between two dates in a human-readable format
   * @param startDate - Start date string
   * @param endDate - End date string (optional, defaults to now)
   * @returns Human-readable time difference
   */
  static getTimeDifference(startDate: string, endDate?: string): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMs = end.getTime() - start.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}