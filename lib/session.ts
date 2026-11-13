import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';

// Server-only. Import this from route handlers, never from client components.

export type Role = 'demo' | 'owner';

export const SESSION_COOKIE = 'drone-session';
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

// Public on purpose: it is shown on the login screen.
export const DEMO_PASSPHRASE = 'demo';

// Without SESSION_SECRET the key changes on every restart, which logs everyone out.
const secret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function sameText(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

function sign(payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function roleForPassphrase(input: unknown): Role | null {
  if (typeof input !== 'string') return null;
  const entered = normalize(input);
  if (!entered) return null;

  // The demo passphrase is checked first and can only ever give the demo role.
  if (entered === DEMO_PASSPHRASE) return 'demo';

  const ownerPassphrase = normalize(process.env.DRONE_PASSPHRASE ?? '');
  if (!ownerPassphrase || ownerPassphrase === DEMO_PASSPHRASE) return null;

  return sameText(entered, ownerPassphrase) ? 'owner' : null;
}

export function createSessionToken(role: Role): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${role}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function roleFromToken(token: string | undefined): Role | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [role, expires, signature] = parts;
  if (role !== 'demo' && role !== 'owner') return null;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now() / 1000) return null;

  const expected = sign(`${role}.${expires}`);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  return role;
}
