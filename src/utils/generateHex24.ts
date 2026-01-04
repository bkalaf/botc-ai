// src/utils/generateHex24.ts
import crypto from 'crypto';

export function generateHex24(): string {
    const bytes = new Uint8Array(12); // 12 bytes = 24 hex chars
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
