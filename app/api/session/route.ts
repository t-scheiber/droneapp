import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  roleForPassphrase,
  roleFromToken,
} from '@/lib/session';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

function isHttps(request: NextRequest): boolean {
  return request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
}

export async function GET(request: NextRequest) {
  const role = roleFromToken(request.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ role }, { headers: noStore });
}

export async function POST(request: NextRequest) {
  let passphrase: unknown;
  try {
    ({ passphrase } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: noStore });
  }

  const role = roleForPassphrase(passphrase);
  if (!role) {
    // Slow down guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 750));
    return NextResponse.json({ error: 'Incorrect passphrase' }, { status: 401, headers: noStore });
  }

  const response = NextResponse.json({ role }, { headers: noStore });
  response.cookies.set(SESSION_COOKIE, createSessionToken(role), {
    httpOnly: true,
    sameSite: 'strict',
    secure: isHttps(request),
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ role: null }, { headers: noStore });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
