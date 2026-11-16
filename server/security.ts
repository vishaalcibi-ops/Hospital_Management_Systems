/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MediCore Enterprise Authentication & Security Service
 * Cryptographically secure password hashing, timing-safe verification,
 * token generation, OTP management, and brute-force rate-limiting.
 */

import crypto from 'crypto';

// In-memory rate limiting & lockout tracker
interface RateLimitRecord {
  attempts: number;
  lockedUntil?: number;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_ATTEMPTS = 3;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const ACTIVATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hash a password using PBKDF2 with SHA-512 and 100,000 iterations.
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash: derivedKey, salt };
}

/**
 * Verify a password against stored salt and hash using constant-time comparison.
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (derivedKey.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch (err) {
    return false;
  }
}

/**
 * Generate a cryptographically secure random token (e.g. for account activation or password reset).
 */
export function generateSecureToken(prefix: string = 'tok'): string {
  const bytes = crypto.randomBytes(32).toString('hex');
  return `${prefix}_${bytes}`;
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP.
 */
export function generateNumericOtp(): { otp: string; hash: string; salt: string; expiresAt: number } {
  const otpNumber = crypto.randomInt(100000, 999999);
  const otp = otpNumber.toString();
  const salt = crypto.randomBytes(12).toString('hex');
  const hash = crypto.pbkdf2Sync(otp, salt, 50000, 32, 'sha256').toString('hex');
  const expiresAt = Date.now() + OTP_EXPIRY_MS;
  return { otp, hash, salt, expiresAt };
}

/**
 * Verify a 6-digit numeric OTP against stored hash and salt.
 */
export function verifyOtp(inputOtp: string, salt: string, storedHash: string, expiresAt: number): { valid: boolean; reason?: string } {
  if (Date.now() > expiresAt) {
    return { valid: false, reason: 'OTP has expired. Please request a new verification code.' };
  }
  try {
    const derivedKey = crypto.pbkdf2Sync(inputOtp.trim(), salt, 50000, 32, 'sha256');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (derivedKey.length !== storedBuffer.length) {
      return { valid: false, reason: 'Invalid OTP code.' };
    }
    const match = crypto.timingSafeEqual(derivedKey, storedBuffer);
    if (!match) {
      return { valid: false, reason: 'Incorrect verification code.' };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Verification failed.' };
  }
}

/**
 * Check if an IP / email is currently rate-limited or locked out.
 */
export function checkRateLimit(key: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  // Check lockout
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSec = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  // Reset if expired past lockout
  if (record.lockedUntil && record.lockedUntil <= now) {
    rateLimitStore.delete(key);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.attempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

/**
 * Record a failed authentication attempt.
 */
export function recordFailedAttempt(key: string): { remainingAttempts: number; isLocked: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { attempts: 0, lastAttempt: now };
  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    rateLimitStore.set(key, record);
    return { remainingAttempts: 0, isLocked: true, retryAfterSec: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  rateLimitStore.set(key, record);
  return { remainingAttempts: MAX_LOGIN_ATTEMPTS - record.attempts, isLocked: false };
}

/**
 * Reset rate limit tracker after successful authentication.
 */
export function resetFailedAttempts(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Generate unique Patient ID / UHID.
 * Format: MC-YYYY-XXXXX (e.g. MC-2026-84920)
 */
export function generateUhid(): string {
  const year = new Date().getFullYear();
  const random5Digits = crypto.randomInt(10000, 99999);
  return `MC-${year}-${random5Digits}`;
}

export {
  ACTIVATION_TOKEN_EXPIRY_MS,
  MAX_OTP_ATTEMPTS,
  OTP_EXPIRY_MS
};
