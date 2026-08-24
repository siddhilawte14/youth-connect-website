import crypto from 'crypto';
import env from '../config/env.js';

/**
 * Generate HMAC-SHA256 signature for a ticket's core data.
 * Used to prove QR code authenticity at the gate scanner.
 */
export function signPass(ticketId, eventId, userId) {
  const payload = `${ticketId}:${eventId}:${userId}`;
  return crypto.createHmac('sha256', env.QR_HMAC_SECRET).update(payload).digest('hex');
}

/**
 * Verify an HMAC-SHA256 signature.
 */
export function verifyPassSignature(ticketId, eventId, userId, signature) {
  try {
    const expected = signPass(ticketId, eventId, userId);
    const expectedBuf = Buffer.from(expected, 'hex');
    const signatureBuf = Buffer.from(signature, 'hex');
    if (expectedBuf.length !== signatureBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch {
    return false;
  }
}

/**
 * Generate a unique ticket ID in the format TKT-XXXX-YYY
 */
export function generateTicketId(categoryHint = 'GEN') {
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = categoryHint.substring(0, 3).toUpperCase();
  return `TKT-${num}-${suffix}`;
}

/**
 * Generate SHA-256 hash for audit log integrity.
 */
export function sha256Hash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}
