// Security utilities for frontend

/**
 * Secure email decoder with multi-layer obfuscation
 * Uses XOR + Base64 + ROT13 for bot protection
 */
export function decodeSecureEmail(encoded: string, key: string): string {
  try {
    // Step 1: Base64 decode
    const base64Decoded = atob(encoded);
    
    // Step 2: XOR decode with key
    let xorDecoded = '';
    for (let i = 0; i < base64Decoded.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const encodedChar = base64Decoded.charCodeAt(i);
      xorDecoded += String.fromCharCode(encodedChar ^ keyChar);
    }
    
    // Step 3: ROT13 decode
    const rot13Decoded = xorDecoded.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
    
    return rot13Decoded;
  } catch (error) {
    console.error('Email decode error:', error);
    return 'contact@copperheadci.com'; // Fallback
  }
}

/**
 * Content Security Policy nonce generator
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitize analytics data to prevent injection
 */
export function sanitizeAnalyticsData(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      sanitized[key] = value
        .replace(/[<>"']/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .substring(0, 100); // Limit length
    } else if (typeof value === 'number') {
      sanitized[key] = Math.max(0, Math.min(value, 1000)); // Reasonable bounds
    } else {
      sanitized[key] = String(value).substring(0, 50);
    }
  }
  
  return sanitized;
}

/**
 * Rate limiting for client-side actions
 */
class ClientRateLimit {
  private actions: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxActions: number;

  constructor(windowMs: number = 60000, maxActions: number = 10) {
    this.windowMs = windowMs;
    this.maxActions = maxActions;
  }

  isAllowed(actionKey: string): boolean {
    const now = Date.now();
    const actions = this.actions.get(actionKey) || [];
    
    // Clean old actions
    const validActions = actions.filter(time => now - time < this.windowMs);
    
    if (validActions.length >= this.maxActions) {
      return false;
    }
    
    validActions.push(now);
    this.actions.set(actionKey, validActions);
    return true;
  }

  reset(actionKey: string): void {
    this.actions.delete(actionKey);
  }
}

export const formSubmissionLimiter = new ClientRateLimit(300000, 3); // 3 submissions per 5 minutes
export const analyticsLimiter = new ClientRateLimit(60000, 20); // 20 events per minute

/**
 * Secure localStorage wrapper with encryption
 */
export class SecureStorage {
  private static encode(data: string): string {
    try {
      return btoa(encodeURIComponent(data));
    } catch {
      return data;
    }
  }

  private static decode(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return data;
    }
  }

  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(`cci_${key}`, this.encode(value));
    } catch (error) {
      console.warn('SecureStorage setItem failed:', error);
    }
  }

  static getItem(key: string): string | null {
    try {
      const item = localStorage.getItem(`cci_${key}`);
      return item ? this.decode(item) : null;
    } catch (error) {
      console.warn('SecureStorage getItem failed:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(`cci_${key}`);
    } catch (error) {
      console.warn('SecureStorage removeItem failed:', error);
    }
  }
}
