/**
 * Validation utility functions for forms and data
 */

export class ValidationUtils {
  /**
   * Validates US ZIP code format
   * @param zipCode - ZIP code to validate
   * @returns True if valid ZIP code format
   */
  static isValidZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }

  /**
   * Validates email format
   * @param email - Email to validate
   * @returns True if valid email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates phone number format (US)
   * @param phone - Phone number to validate
   * @returns True if valid phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validates that a string is not empty or whitespace only
   * @param value - String to validate
   * @returns True if string has content
   */
  static isNotEmpty(value: string): boolean {
    return value != null && value.trim().length > 0;
  }

  /**
   * Validates minimum length requirement
   * @param value - String to validate
   * @param minLength - Minimum required length
   * @returns True if string meets minimum length
   */
  static hasMinLength(value: string, minLength: number): boolean {
    return value != null && value.length >= minLength;
  }

  /**
   * Validates maximum length requirement
   * @param value - String to validate
   * @param maxLength - Maximum allowed length
   * @returns True if string is within maximum length
   */
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value != null && value.length <= maxLength;
  }

  /**
   * Validates that a value is a valid number
   * @param value - Value to validate
   * @returns True if value is a number
   */
  static isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Validates that a number is within a range
   * @param value - Number to validate
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns True if number is within range
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Sanitizes a string by removing potentially harmful characters
   * @param input - String to sanitize
   * @returns Sanitized string
   */
  static sanitizeString(input: string): string {
    return input.replace(/[<>\"'&]/g, '');
  }

  /**
   * Formats a string to title case
   * @param input - String to format
   * @returns Title case string
   */
  static toTitleCase(input: string): string {
    return input.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}