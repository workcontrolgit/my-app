/**
 * Object manipulation utility functions
 */

export class ObjectUtils {
  /**
   * Deep clone an object
   * @param obj - Object to clone
   * @returns Deep cloned object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Check if an object is empty
   * @param obj - Object to check
   * @returns True if object is empty
   */
  static isEmpty(obj: any): boolean {
    if (obj == null) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    return Object.keys(obj).length === 0;
  }

  /**
   * Get nested property value safely
   * @param obj - Object to search in
   * @param path - Dot notation path (e.g., 'user.profile.name')
   * @param defaultValue - Default value if path doesn't exist
   * @returns Property value or default value
   */
  static getNestedProperty(obj: any, path: string, defaultValue: any = null): any {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : defaultValue, obj
    );
  }

  /**
   * Set nested property value safely
   * @param obj - Object to modify
   * @param path - Dot notation path
   * @param value - Value to set
   */
  static setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Merge two objects deeply
   * @param target - Target object
   * @param source - Source object
   * @returns Merged object
   */
  static deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceValue = source[key];
        const targetValue = (result as any)[key];
        
        if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
            targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
          (result as any)[key] = this.deepMerge(targetValue, sourceValue);
        } else {
          (result as any)[key] = sourceValue;
        }
      }
    }
    
    return result;
  }

  /**
   * Remove properties with null or undefined values
   * @param obj - Object to clean
   * @returns Cleaned object
   */
  static removeNullUndefined(obj: any): any {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj[key] != null) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          cleaned[key] = this.removeNullUndefined(obj[key]);
        } else {
          cleaned[key] = obj[key];
        }
      }
    }
    return cleaned;
  }

  /**
   * Compare two objects for equality
   * @param obj1 - First object
   * @param obj2 - Second object
   * @returns True if objects are equal
   */
  static isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Generate a unique ID
   * @returns Unique string ID
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}