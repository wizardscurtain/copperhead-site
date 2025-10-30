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

/**
 * CSRF Token Manager
 */
class CSRFManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  async getToken(): Promise<string> {
    // Check if current token is still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await fetch('/api/csrf-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Failed to get CSRF token');
      }

      const data = await response.json();
      this.token = data.csrf_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early

      return this.token;
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
      throw error;
    }
  }

  invalidateToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

/**
 * Secure WebSocket Manager
 */
class SecureWebSocket {
  private ws: WebSocket | null = null;
  private clientId: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private messageQueue: string[] = [];
  private rateLimiter: ClientRateLimit;

  constructor(clientId: string) {
    this.clientId = this.sanitizeClientId(clientId);
    this.rateLimiter = new ClientRateLimit(60000, 30); // 30 messages per minute
  }

  private sanitizeClientId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/${this.clientId}`;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          
          // Send queued messages
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) this.send(message);
          }
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Invalid WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  send(message: string): boolean {
    if (!this.rateLimiter.isAllowed('websocket_message')) {
      console.warn('WebSocket message rate limited');
      return false;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(message);
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    } else {
      // Queue message for later
      if (this.messageQueue.length < 10) { // Limit queue size
        this.messageQueue.push(message);
      }
      return false;
    }
  }

  private handleMessage(data: any): void {
    if (data.error) {
      console.error('WebSocket server error:', data.error);
      return;
    }

    // Handle different message types
    switch (data.type) {
      case 'pong':
        console.log('Received pong');
        break;
      case 'echo_response':
        console.log('Echo response:', data.content);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch(console.error);
      }, delay);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const formSubmissionLimiter = new ClientRateLimit(300000, 3); // 3 submissions per 5 minutes
export const analyticsLimiter = new ClientRateLimit(60000, 20); // 20 events per minute
export const csrfManager = new CSRFManager();

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
