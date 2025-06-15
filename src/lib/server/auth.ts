// --- Auth helpers for SvelteKit (Node.js) ---
// This file contains all password/JWT logic for the Node backend.
// To port to Tauri (Rust), see the notes below.

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

// Hash a password (Node.js, bcrypt)
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// Compare a password to a hash (Node.js, bcrypt)
export async function comparePasswords(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// Sign a JWT (Node.js, jsonwebtoken)
export function signToken(payload: { userId: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify a JWT (Node.js, jsonwebtoken)
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// --- Tauri/Rust integration notes ---
// To port this logic to Rust (for Tauri backend):
// - Use the 'jsonwebtoken' crate for JWT sign/verify in Rust.
// - Use the 'bcrypt' crate for password hashing/comparison in Rust.
// - Store JWT in Tauri's secure storage or filesystem for offline mode.
// - Expose Rust commands to SvelteKit frontend via Tauri API for login/register.

// --- Tauri-specific JWT storage stub (frontend) ---
// In SvelteKit, use cookies for JWT. In Tauri, use secure storage:
// Example (pseudo-code):
//   import { invoke } from '@tauri-apps/api/tauri';
//   await invoke('store_jwt', { token });
//   const token = await invoke('get_jwt');
// Implement these Rust commands in your Tauri backend.